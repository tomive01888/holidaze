import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

/**
 * A user-friendly 404 "Not Found" page.
 */
const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-start h-screen text-center px-4">
      <h1 className="text-6xl md:text-9xl font-black text-neutral-50">404</h1>
      <h2 className="text-2xl md:text-4xl font-bold mt-4 text-neutral-200">Page Not Found</h2>
      <p className="text-neutral-200 text-lg mt-2 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you may have typed
        the address incorrectly.
      </p>
      <Link to="/" className="mt-8" tabIndex={-1}>
        <Button variant="primary" size="lg">
          Go Back to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
