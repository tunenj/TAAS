import Image from 'next/image'

export default function Hero() {
    return (
        <div className="relative w-full h-screen">
            {/* Background Image with fill */}
            <Image
                className="absolute inset-0 bg-center filter brightness-105"
                src="/images/cover.png"
                alt="Cover image"
                fill
                style={{ objectFit: 'cover' }}
                priority
            />

            {/* Content on top */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 mt-10 md:mt-36 text-center md:text-left px-4 md:px-0">
                    <span className="text-black flex justify-center items-center mb-4">
                        Simplify Testing
                    </span>
                    <div className="text-black flex justify-center items-center">
                        Today with Avetium
                    </div>
                </h1>
                <p className="font-bold text-black mt-2 max-w-2xl leading-relaxed px-4 sm:px-0">
                    Revolutionize your software quality assurance with powered Test as a Service (TaaS),
                    delivering unparalleled efficiency and reliability.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-12 sm:mt-24 px-4 sm:px-0">
                    <a href="#"
                        className="text-white bg-[#E95D28] px-8 py-3 rounded-xl font-semibold text-center">
                        Get Started
                    </a>
                    <a href="#"
                        className="text-[#E95D28] border border-[#E95D28] px-6 py-3 rounded-xl font-semibold text-center">
                        Request Demo
                    </a>
                </div>
            </div>
        </div>
    )
}
