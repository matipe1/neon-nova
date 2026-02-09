import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1>Hello, Neon Nova!</h1>
      <Link href="/calculadora">
        <button className="text-violet-600 bg-violet-100 cursor-pointer border p-2 rounded-2xl">Go to Calculator</button>
      </Link>
    </>
  );
}