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

	const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay */}
			<div 
				className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
				onClick={onClose}
			/>
			
			{/* Mobile navigation panel */}
			<div className="fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">Menu</h2>
					<button
						onClick={onClose}
						className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Navigation content */}
				<div className="flex flex-col h-full">
					{/* User section */}
					{user ? (
						<div className="p-4 border-b border-gray-200">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
									<User className="w-6 h-6 text-white" />
								</div>
								<div>
									<p className="font-medium text-gray-900">{user.name || user.email}</p>
									<p className="text-sm text-gray-500 capitalize">{user.role}</p>
								</div>
							</div>
						</div>
					) : (
						<div className="p-4 border-b border-gray-200">
							<div className="space-y-2">
								<Link
									href="/login"
									className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
									onClick={onClose}
								>
									Login
								</Link>
								<Link
									href="/register"
									className="block w-full px-4 py-2 text-center border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
									onClick={onClose}
								>
									Register
								</Link>
							</div>
						</div>
					)}

					{/* Navigation links */}
					<div className="flex-1 py-4">
						<nav className="space-y-1">
							<Link
								href="/"
								className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
								onClick={onClose}
							>
								<Home className="w-5 h-5 mr-3" />
								Home
							</Link>
							
							<Link
								href="/products"
								className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
								onClick={onClose}
							>
								<Grid3X3 className="w-5 h-5 mr-3" />
								Products
							</Link>
							
							<Link
								href="/categories"
								className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
								onClick={onClose}
							>
								<Grid3X3 className="w-5 h-5 mr-3" />
								Categories
							</Link>
							
							<Link
								href="/cart"
								className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
								onClick={onClose}
							>
								<ShoppingCart className="w-5 h-5 mr-3" />
								<span>Cart</span>
								{cartItemCount > 0 && (
									<span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
										{cartItemCount > 99 ? '99+' : cartItemCount}
									</span>
								)}
							</Link>
							
							{user && (
								<>
									<Link
										href="/account"
										className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
										onClick={onClose}
									>
										<User className="w-5 h-5 mr-3" />
										My Account
									</Link>
									
									<Link
										href="/orders"
										className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
										onClick={onClose}
									>
										<Grid3X3 className="w-5 h-5 mr-3" />
										Orders
									</Link>
								</>
							)}
							
							<Link
								href="/about"
								className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
								onClick={onClose}
							>
								<Info className="w-5 h-5 mr-3" />
								About
							</Link>
							
							<Link
								href="/contact"
								className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
								onClick={onClose}
							>
								<Phone className="w-5 h-5 mr-3" />
								Contact
							</Link>
						</nav>
					</div>

					{/* Logout button for logged in users */}
					{user && (
						<div className="p-4 border-t border-gray-200">
							<button
								onClick={handleLogout}
								className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
							>
								Logout
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
