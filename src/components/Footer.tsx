import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[rgb(var(--card-bg))] shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="text-secondary-600 dark:text-secondary-300">
              Your trusted source for quality electronics and computer parts.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-secondary-600 dark:text-secondary-300">
              <li>Email: info@e-pasaulis.lt</li>
              <li>Phone: +370 63605050</li>
              <li>Address: Klaipėda, Lithuania</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-200 dark:border-secondary-700 mt-8 pt-8 text-center text-secondary-600 dark:text-secondary-300">
          <p>&copy; {new Date().getFullYear()} E-Pasaulis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 