import { Heart, Mail, Coffee, Gift, DollarSign, BookOpen, MessageCircle, Shield, Scale, FileText, Link as LinkIcon } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { IoLogoSkype } from "react-icons/io";
import { FaGlobeEurope, FaLock } from "react-icons/fa";
import { Link } from "wouter";
import './footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="footer" className="footer-package site-footer mt-0">
      <div className="footer-wrapper">
        <div className="footer-columns">
          {/* Column 1 - Support My Work */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Support My Work:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a 
                href="https://patreon.com/StanislavNikov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                <span>Patreon</span>
              </a>
              <a 
                href="https://www.gofundme.com/u/stanislavmnikov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <Gift className="h-3 w-3 mr-1" />
                <span>GoFundMe</span>
              </a>
              <a 
                href="https://buymeacoffee.com/stanislavnikov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <Coffee className="h-3 w-3 mr-1" />
                <span>Buy Me a Coffee</span>
              </a>
              <a 
                href="https://www.kickstarter.com/profile/stanislavmnikov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <Gift className="h-3 w-3 mr-1" />
                <span>Kickstarter</span>
              </a>
              <a 
                href="https://www.indiegogo.com/individuals/11407710" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <Gift className="h-3 w-3 mr-1" />
                <span>Indiegogo</span>
              </a>
              <a 
                href="https://substack.com/@stanislavnikov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                <span>Substack</span>
              </a>
              <a 
                href="https://crowdfundly.com/stanislavmnikov-106236004275619780202" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <Gift className="h-3 w-3 mr-1" />
                <span>Crowdfundly</span>
              </a>
              <a 
                href="https://en.tipeee.com/user/stanislav-10" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <Coffee className="h-3 w-3 mr-1" />
                <span>Tipeee</span>
              </a>
            </div>
          </div>
          
          {/* Column 2 - Legal Information */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Legal Information:</p>
            <div className="space-y-1 text-[10px] text-gray-500 dark:text-gray-500">
              <div className="flex items-start">
                <FaGlobeEurope className="h-3 w-3 mr-1 mt-0.5" />
                <span className="leading-tight">
                  Registered in Germany<br />
                  USt-IdNr.: DE123456789
                </span>
              </div>
              <div className="flex items-start">
                <Scale className="h-3 w-3 mr-1 mt-0.5" />
                <span className="leading-tight">
                  EU GDPR Compliant<br />
                  Datenschutzbeauftragter
                </span>
              </div>
              <div className="flex items-center">
                <Shield className="h-2.5 w-2.5 mr-1" />
                <Link href="/imprint">
                  <span className="hover:text-indigo-500 transition-colors duration-200 cursor-pointer">Impressum (Imprint)</span>
                </Link>
              </div>
              <div className="flex items-center">
                <FaLock className="h-2.5 w-2.5 mr-1" />
                <Link href="/privacy">
                  <span className="hover:text-indigo-500 transition-colors duration-200 cursor-pointer">Datenschutzerklärung</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Column 3 - Disclaimer and Quote */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disclaimer:</p>
            <div>
              <div className="flex items-start">
                <FileText className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span className="text-[10px] text-gray-500 dark:text-gray-500 leading-tight">
                  The content on this website is for informational purposes only. All product names, logos, and brands are property of their respective owners.
                  All company, product and service names used are for identification purposes only.
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs italic text-gray-500 dark:text-gray-500">
                  "Nothing gets you nowhere, but everything gets you somewhere!"
                </p>
              </div>
            </div>
          </div>
          
          {/* Column 4 - Contact Me */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Me:</p>
            <div className="flex flex-col gap-2 text-xs">
              <a 
                href="mailto:thekingofburden@gmail.com" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <Mail className="h-3 w-3 mr-1" />
                <span>thekingofburden@gmail.com</span>
              </a>
              <a 
                href="https://discord.com/users/TheKingOfBurden" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <SiDiscord className="h-3 w-3 mr-1" />
                <span>thekingofburden#</span>
              </a>
              <a 
                href="skype:thekingofburden?chat" 
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <IoLogoSkype className="h-3 w-3 mr-1" />
                <span>thekingofburden</span>
              </a>
              <a 
                href="https://thekingofburden.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-indigo-500 transition-colors duration-200"
              >
                <LinkIcon className="h-3 w-3 mr-1" />
                <span>thekingofburden.com</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom row - exactly as in Fiverr */}
        <div className="footer-bottom">
          <div className="left">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {currentYear} All rights reserved.
            </p>
          </div>
          
          <div className="center">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <span>by </span>
              <a 
                href="https://linktr.ee/StanislavNikov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-indigo-500 transition-colors duration-200 ml-1"
              >
                Stanislav Nikov
              </a>
            </div>
          </div>
          
          <div className="right">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              All content for informational purposes only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
