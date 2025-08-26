"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RootState, AppDispatch } from "@/redux/store";
import { createOrder } from "@/redux/slices/orderSlice";
import { clearCart } from "@/redux/slices/cartSlice";
import { 
  ArrowLeft, 
  Truck, 
  Shield,
  CreditCard,
  MapPin,
  Phone,
  User,
  Mail,
  CheckCircle,
  ShoppingCart,
  AlertCircle,
  Package
} from "lucide-react";

interface CheckoutForm {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Options
  paymentMethod: 'card' | 'paypal' | 'cash_on_delivery';
  notes: string;
  terms: boolean;
}

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading: orderLoading, error: orderError } = useSelector((state: RootState) => state.orders);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState<CheckoutForm>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'România',
    paymentMethod: 'card',
    notes: '',
    terms: false
  });

  // Calculate costs
  const subtotal = total;
  const shipping = subtotal > 200 ? 0 : 25;
  const tax = Math.round(subtotal * 0.19 * 100) / 100; // 19% VAT
  const finalTotal = subtotal + shipping + tax;

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      // Personal info validation
      if (!form.firstName.trim()) errors.firstName = 'Prenumele este obligatoriu';
      if (!form.lastName.trim()) errors.lastName = 'Numele este obligatoriu';
      if (!form.email.trim()) errors.email = 'Email-ul este obligatoriu';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email-ul nu este valid';
      if (!form.phone.trim()) errors.phone = 'Telefonul este obligatoriu';
    }
    
    if (step === 2) {
      // Address validation
      if (!form.street.trim()) errors.street = 'Adresa este obligatorie';
      if (!form.city.trim()) errors.city = 'Orașul este obligatoriu';
      if (!form.state.trim()) errors.state = 'Județul este obligatoriu';
      if (!form.zipCode.trim()) errors.zipCode = 'Codul poștal este obligatoriu';
    }
    
    if (step === 3) {
      // Final validation
      if (!form.terms) errors.terms = 'Trebuie să accepți termenii și condițiile';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(3)) return;
    
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert cart items to order items
      const orderItems = items.map(item => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.imageUrl
      }));

      // Create order
      const orderData = {
        userId: user.uid,
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total: finalTotal,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        paymentMethod: form.paymentMethod,
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
          phone: form.phone
        },
        notes: form.notes
      };

      await dispatch(createOrder(orderData)).unwrap();
      
      // Clear cart and show success
      dispatch(clearCart());
      setOrderSuccess(true);
      
      // Redirect to success page after delay
      setTimeout(() => {
        router.push('/orders');
      }, 3000);

    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Coșul tău este gol</h1>
          <p className="text-gray-600 mb-6">Adaugă produse în coș pentru a continua.</p>
          <Link href="/products">
            <Button>Descoperă produsele</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Comanda plasată cu succes!</h1>
          <p className="text-gray-600 mb-6">
            Îți mulțumim pentru comandă. Vei primi în curând un email de confirmare cu detaliile comenzii.
          </p>
          <div className="space-y-3">
            <Link href="/orders">
              <Button className="w-full">Vezi comenzile tale</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full">Continuă cumpărăturile</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la coș
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Finalizare comandă</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-16 text-sm text-gray-600">
              <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>
                Date personale
              </span>
              <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>
                Livrare
              </span>
              <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>
                Plată
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {orderError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {orderError}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <User className="h-5 w-5 text-blue-600 mr-3" />
                      <h2 className="text-lg font-semibold text-gray-900">Date personale</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prenume *</Label>
                        <Input
                          id="firstName"
                          value={form.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={validationErrors.firstName ? 'border-red-500' : ''}
                        />
                        {validationErrors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lastName">Nume *</Label>
                        <Input
                          id="lastName"
                          value={form.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={validationErrors.lastName ? 'border-red-500' : ''}
                        />
                        {validationErrors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {validationErrors.email && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefon *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            value={form.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`pl-10 ${validationErrors.phone ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {validationErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                      <h2 className="text-lg font-semibold text-gray-900">Adresa de livrare</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="street">Adresa *</Label>
                        <Input
                          id="street"
                          value={form.street}
                          onChange={(e) => handleInputChange('street', e.target.value)}
                          placeholder="Strada, numărul, bloc, scara, etaj, apartament"
                          className={validationErrors.street ? 'border-red-500' : ''}
                        />
                        {validationErrors.street && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.street}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">Oraș *</Label>
                          <Input
                            id="city"
                            value={form.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={validationErrors.city ? 'border-red-500' : ''}
                          />
                          {validationErrors.city && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="state">Județ *</Label>
                          <Input
                            id="state"
                            value={form.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className={validationErrors.state ? 'border-red-500' : ''}
                          />
                          {validationErrors.state && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="zipCode">Cod poștal *</Label>
                          <Input
                            id="zipCode"
                            value={form.zipCode}
                            onChange={(e) => handleInputChange('zipCode', e.target.value)}
                            className={validationErrors.zipCode ? 'border-red-500' : ''}
                          />
                          {validationErrors.zipCode && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.zipCode}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="country">Țara</Label>
                        <Input
                          id="country"
                          value={form.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Shipping Options */}
                    <div className="border-t pt-6">
                      <h3 className="font-medium text-gray-900 mb-4">Opțiuni de livrare</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Truck className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="font-medium">Livrare standard</p>
                            <p className="text-sm text-gray-600">3-5 zile lucrătoare</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{shipping > 0 ? `${shipping} Lei` : 'Gratuit'}</p>
                            {shipping === 0 && (
                              <p className="text-xs text-green-600">Livrare gratuită peste 200 Lei</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                      <h2 className="text-lg font-semibold text-gray-900">Metoda de plată</h2>
                    </div>

                    <RadioGroup 
                      value={form.paymentMethod} 
                      onValueChange={(value: string) => handleInputChange('paymentMethod', value)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
                            <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium">Card bancar</p>
                              <p className="text-sm text-gray-600">Visa, MasterCard</p>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="cash_on_delivery" id="cash" />
                          <Label htmlFor="cash" className="flex items-center flex-1 cursor-pointer">
                            <Package className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium">Ramburs</p>
                              <p className="text-sm text-gray-600">Plată la livrare</p>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="flex items-center flex-1 cursor-pointer">
                            <Shield className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium">PayPal</p>
                              <p className="text-sm text-gray-600">Plată securizată PayPal</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    <div>
                      <Label htmlFor="notes">Observații comandă</Label>
                      <Textarea
                        id="notes"
                        value={form.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Observații speciale pentru comandă..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={form.terms}
                        onCheckedChange={(checked) => handleInputChange('terms', !!checked)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-5">
                        Sunt de acord cu{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Termenii și Condițiile
                        </Link>{' '}
                        și{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Politica de Confidențialitate
                        </Link>
                      </Label>
                    </div>
                    {validationErrors.terms && (
                      <p className="text-red-500 text-sm">{validationErrors.terms}</p>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  {currentStep > 1 ? (
                    <Button variant="outline" onClick={prevStep}>
                      Înapoi
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <Button onClick={nextStep}>
                      Continuă
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting || orderLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting || orderLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Se procesează...
                        </div>
                      ) : (
                        'Plasează comanda'
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Sumar comandă</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-600">Cantitate: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {(item.price * item.quantity).toLocaleString('ro-RO')} Lei
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Cost Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{subtotal.toLocaleString('ro-RO')} Lei</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livrare</span>
                    <span className="font-medium">
                      {shipping > 0 ? `${shipping.toLocaleString('ro-RO')} Lei` : 'Gratuit'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TVA (19%)</span>
                    <span className="font-medium">{tax.toLocaleString('ro-RO')} Lei</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{finalTotal.toLocaleString('ro-RO')} Lei</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Plată securizată SSL</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
