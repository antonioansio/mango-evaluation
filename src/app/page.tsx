import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-5">
          Technical evaluation for Mango
        </h1>
        <div className="flex gap-4 justify-center">
          <Link href="/exercise1" className="text-gray-600 hover:text-gray-800">
            Exercise 1
          </Link>
          <Link href="/exercise2" className="text-gray-600 hover:text-gray-800">
            Exercise 2
          </Link>
        </div>
      </div>
    </div>
  );
}
