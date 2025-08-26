import Image from "next/image";
import Link from "next/link";
// Accepts Category with optional image, matching usage in app/page.tsx
interface Category {
  id: string;
  name: string;
  image?: string;
}

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.id}`} className="block group">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 flex flex-col items-center p-6 border-2 border-transparent group-hover:border-blue-300">
        <div className="relative w-20 h-20 mb-3 p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full shadow-md">
          <Image
            src={category.image || "/file.svg"}
            alt={category.name}
            fill
            className="object-contain p-2"
            sizes="80px"
            priority
          />
        </div>
        <div className="font-bold text-lg text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-blue-700 group-hover:to-pink-700 transition-all">
          {category.name}
        </div>
      </div>
    </Link>
  );
}
