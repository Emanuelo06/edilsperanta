"use client";
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { logoutUser } from '@/redux/slices/authSlice';
import { X, User, ShoppingCart, Home, Grid3X3, Phone, Info } from 'lucide-react';

interface MobileNavProps {
	isOpen: boolean;
	onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
	const { user } = useSelector((state: RootState) => state.auth);
	const { items } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>();

	const handleLogout = () => {
		dispatch(logoutUser());
		onClose();
	};

	const cartItemCount = items.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay */}
			<div 
				className="fixed inset-0 bg-black/50 z-50 lg:hidden"
				onClick={onClose}
			/>
			
			{/* Navigation Panel */}
			<nav className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform translate-x-0 transition-transform duration-300 ease-in-out lg:hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-semibold">Meniu</h2>
					<button 
						onClick={onClose}
						className="p-2 rounded-lg hover:bg-gray-100"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Navigation Content */}
				<div className="flex flex-col h-[calc(100%-80px)]">
					{/* Main Navigation */}
					<div className="flex-1 px-4 py-6 space-y-2">
						<Link 
							href="/" 
							onClick={onClose}
							className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
						>
							<Home className="w-5 h-5" />
							<span>Acasă</span>
						</Link>
						
						<Link 
							href="/products" 
							onClick={onClose}
							className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
						>
							<Grid3X3 className="w-5 h-5" />
							<span>Produse</span>
						</Link>
						
						<Link 
							href="/contact" 
							onClick={onClose}
							className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
						>
							<Phone className="w-5 h-5" />
							<span>Contact</span>
						</Link>
						
						<Link 
							href="/about" 
							onClick={onClose}
							className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
						>
							<Info className="w-5 h-5" />
							<span>Despre noi</span>
						</Link>

						{/* Cart */}
						<Link 
							href="/cart" 
							onClick={onClose}
							className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
						>
							<div className="flex items-center gap-3">
								<ShoppingCart className="w-5 h-5" />
								<span>Coșul meu</span>
							</div>
							{cartItemCount > 0 && (
								<span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
									{cartItemCount}
								</span>
							)}
						</Link>
					</div>

					{/* User Section */}
					<div className="border-t px-4 py-4">
						{user ? (
							<div className="space-y-2">
								<Link 
									href="/account" 
									onClick={onClose}
									className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
								>
									<User className="w-5 h-5" />
									<span>Contul meu</span>
								</Link>
								<button
									onClick={handleLogout}
									className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-red-600"
								>
									<span>Ieși din cont</span>
								</button>
							</div>
						) : (
							<div className="space-y-2">
								<Link 
									href="/auth/login" 
									onClick={onClose}
									className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
								>
									Conectează-te
								</Link>
								<Link 
									href="/auth/register" 
									onClick={onClose}
									className="block w-full px-4 py-2 border border-blue-600 text-blue-600 text-center rounded-lg hover:bg-blue-50"
								>
									Creează cont
								</Link>
							</div>
						)}
					</div>
				</div>
			</nav>
		</>
	);
}
