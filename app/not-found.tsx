import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-stone">404</p>
      <h1 className="mt-5 text-display">
        This page has <em>moved on</em>
      </h1>
      <p className="mt-6 max-w-md text-stone">The page you&apos;re looking for doesn&apos;t exist — but the new collection does.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/shop/new-arrivals">Shop new arrivals</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
