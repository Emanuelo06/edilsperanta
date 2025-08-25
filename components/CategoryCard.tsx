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
      <div className="bg-white rounded-lg shadow group-hover:shadow-lg transition flex flex-col items-center p-6">
        <div className="relative w-20 h-20 mb-3">
          <Image
            src={category.image || "/file.svg"}
            alt={category.name}
            fill
            className="object-contain"
            sizes="80px"
            priority
          />
        </div>
        <div className="font-semibold text-lg text-center group-hover:text-primary transition">
          {category.name}
        </div>
      </div>
    </Link>
  );
}
