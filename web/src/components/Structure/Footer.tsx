import { FC } from "react";

interface FooterProps {}
const Footer: FC<FooterProps> = ({}) => (
    <footer className="footer py-4 px-4 bottom-0">
        <section className="py-8 w-full">
            <div className="container mx-auto px-8">
                <div className="table w-full">
                    <div className="block sm:table-cell">
                        <p className="uppercase text-grey text-sm sm:mb-6">
                            Links
                        </p>
                        <ul className="list-reset text-xs mb-6 list-none m-0">
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    href="/faq"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    FAQ
                                </a>
                            </li>
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    href="/help"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    Help
                                </a>
                            </li>
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    target="_blank"
                                    href="https://streamelements.com/jjakuu/tip"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="block sm:table-cell">
                        <p className="uppercase text-grey text-sm sm:mb-6">
                            Legal
                        </p>
                        <ul className="list-reset text-xs mb-6 list-non m-0">
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    href="#"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    Terms
                                </a>
                            </li>
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    href="#"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    Privacy
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="block sm:table-cell">
                        <p className="uppercase text-grey text-sm sm:mb-6">
                            Social
                        </p>
                        <ul className="list-reset text-xs mb-6">
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    target="_blank"
                                    href="https://discord.gg/FcTFg2E"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    Discord
                                </a>
                            </li>
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    target="_blank"
                                    href="https://github.com/Technicalmc-xyz"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    GitHub
                                </a>
                            </li>
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    target="_blank"
                                    href="https://www.reddit.com/r/technicalminecraft/"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    Reddit
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="block sm:table-cell">
                        <p className="uppercase text-grey text-sm sm:mb-6">
                            Us
                        </p>
                        <ul className="list-reset text-xs mb-6">
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    href="/about"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    About Us
                                </a>
                            </li>
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    href="/contact"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="block sm:table-cell">
                        <p className="uppercase text-grey text-sm sm:mb-6">
                            Wiki
                        </p>
                        <ul className="list-reset text-xs mb-6">
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    href="/style-guide"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    Styling
                                </a>
                            </li>
                            <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                                <a
                                    href="https://github.com/Technicalmc-xyz/technicalmc.xyz/projects/2"
                                    target="_blank"
                                    className="text-grey hover:text-grey-dark"
                                >
                                    Plans
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </footer>
);
export default Footer;
