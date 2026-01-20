"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SubItem {
  label: string;
  value: string;
}

interface Category {
  label: string;
  value: string;
  subItems: SubItem[];
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  basePath: string;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  basePath,
}: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map((cat) => cat.value)
  );

  const toggleCategory = (value: string) => {
    setExpandedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <aside className="w-full">
      <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
        {/* 전체 링크 */}
        <Link
          href={basePath}
          className={`block py-2 px-3 rounded-md transition-colors ${
            selectedCategory === "전체"
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          전체
        </Link>

        <div className="border-t border-gray-200 my-3" />

        {/* 카테고리 아코디언 */}
        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category.value} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleCategory(category.value)}
                className="w-full flex items-center justify-between py-3 px-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <span className="font-semibold text-gray-800 text-sm">{category.label}</span>
                {expandedCategories.includes(category.value) ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {expandedCategories.includes(category.value) && (
                <ul className="pb-2 space-y-1">
                  {category.subItems.map((subItem) => (
                    <li key={subItem.value}>
                      <Link
                        href={`${basePath}?category=${encodeURIComponent(subItem.value)}`}
                        className={`block py-2 px-4 ml-2 text-sm rounded-md transition-colors ${
                          selectedCategory === subItem.value
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
