import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="prose">
      <h1>Page not found</h1>
      <p>
        That page doesn’t exist. Try the <Link href="/">home page</Link>, the <Link href="/map">intel map</Link> or the <Link href="/learn">explainers</Link>.
      </p>
    </div>
  );
}
