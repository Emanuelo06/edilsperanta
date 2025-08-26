"use client";
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { logoutUser } from '@/redux/slices/authSlice';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { MobileNav } from './MobileNavigation';

export default function MainNavbar() {
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const { user } = useSelector((state: RootState) => state.auth);
	const { items } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>();

	const handleLogout = () => {
		dispatch(logoutUser());
	};

	const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

	return (
		<>
			<nav className="bg-white shadow-md sticky top-0 z-50">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<Link href="/" className="flex-shrink-0">
							<span className="text-2xl font-bold text-blue-600">EdilSperanta</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-8">
							<Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
								Products
							</Link>
							<Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">
								Categories
							</Link>
							<Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
								About
							</Link>
							<Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
								Contact
							</Link>
						</div>

						{/* Search Bar (Desktop) */}
						<div className="hidden lg:flex flex-1 max-w-md mx-8">
							<div className="relative w-full">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<input
									type="text"
									placeholder="Search products..."
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Right side items */}
						<div className="flex items-center space-x-4">
							{/* Cart */}
							<Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
								<ShoppingCart className="w-6 h-6" />
								{cartItemCount > 0 && (
									<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
										{cartItemCount > 99 ? '99+' : cartItemCount}
									</span>
								)}
							</Link>

							{/* User Menu */}
							<div className="relative hidden md:block">
								{user ? (
									<div>
										<button
											onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
											className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
										>
											<User className="w-6 h-6" />
											<span className="text-sm">{user.name || user.email}</span>
										</button>
										
										{isUserMenuOpen && (
											<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
												<div className="py-2">
													<Link
														href="/account"
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														onClick={() => setIsUserMenuOpen(false)}
													>
														My Account
													</Link>
													<Link
														href="/orders"
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														onClick={() => setIsUserMenuOpen(false)}
													>
														Orders
													</Link>
													<button
														onClick={() => {
															handleLogout();
															setIsUserMenuOpen(false);
														}}
														className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														Logout
													</button>
												</div>
											</div>
										)}
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<Link
											href="/login"
											className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
										>
											Login
										</Link>
										<Link
											href="/register"
											className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
										>
											Register
										</Link>
									</div>
								)}
							</div>

							{/* Mobile menu button */}
							<button
								onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
								className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
							>
								{isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
							</button>
						</div>
					</div>

					{/* Mobile Search Bar */}
					<div className="md:hidden pb-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="text"
								placeholder="Search products..."
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile Navigation */}
			<MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

			{/* Overlay for user menu */}
			{isUserMenuOpen && (
				<div
					className="fixed inset-0 z-40"
					onClick={() => setIsUserMenuOpen(false)}
				/>
			)}
		</>
	);
}
