import { Trans, useTranslation } from "react-i18next";
import { FaFacebookF, FaTiktok, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiPhone, FiMail } from "react-icons/fi";
import logo from '@/assets/logos/vstu.png'
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div className="text-primary py-12 mt-3 border bg-[#f6fff5]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center justify-center w-full md:w-auto">
            <img
              src={logo} 
              alt="Logo"  
              className="w-16 h-16"
            />
          </div>

          {/* Links Section */}
          <div className="flex flex-col space-y-2 text-sm md:text-base items-center md:items-start">
            <Link to='' className="hover:underline" onClick={() => {
              const element = document.getElementById('whatisVstu');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}>
              {t('common.footer.aboutUs')}
            </Link>
            <Link to="/terms" className="hover:underline">
              {/* Terms & Conditions */}
              {t('common.footer.termsAndConditions')}
            </Link>
            <Link to="/privacy" className="hover:underline">
              {/* Privacy Policy */}
              {t('common.footer.privacyPolicy')}
            </Link>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col space-y-2 text-sm md:text-base items-center md:items-start">
            <p className="flex items-center">
              <FiPhone className="mr-2 text-lg" />
              <div className="flex flex-col items-start justify-center">
                <div className="">+251 911 508 341</div>
                <div className="">+251 930 365 902</div>
                <div className="">+251 912 841 695</div>
              </div>
            </p>
            <p className="flex items-center">
              <FiMail className="mr-2 text-lg" />
              hello@vstu.com
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-t border-primary" />

        {/* Footer Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <p className="text-gray-600 text-sm md:text-base text-center md:text-left">
            Ⓒ <Trans i18nKey="common.footer.allRightReserved" t={t} />
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 text-primary justify-center">
            <Link to="https://www.facebook.com/share/15RKcB4SxJ/?mibextid=wwXIfr" aria-label="Facebook" className="transition-transform transform hover:scale-110">
              <FaFacebookF className="hover:text-secondary text-lg" />
            </Link>
            <Link to="https://www.linkedin.com/company/vstuet/" aria-label="Instagram" className="transition-transform transform hover:scale-110">
              <FaLinkedinIn className="hover:text-secondary text-lg" />
            </Link>
            <Link to="https://x.com/vstuet?s=21" aria-label="X (Twitter)" className="transition-transform transform hover:scale-110">
              <FaXTwitter className="hover:text-secondary text-lg" />
            </Link>
            {/* <Link to="" aria-label="YouTube" className="transition-transform transform hover:scale-110">
              <FaYoutube className="hover:text-secondary text-lg" />
            </Link> */}
            <Link to="https://www.tiktok.com/@vstuet?_t=8si2WWD02PV&_r=1" aria-label="TikTok" className="transition-transform transform hover:scale-110">
              <FaTiktok className="hover:text-secondary text-lg" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
