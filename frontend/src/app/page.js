import Wave from "@/components/FunniWave/FunniWave";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/itinerary_cooker.png";

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden h-screen relative">
      <div className="flex items-center p-8 self-end">
        <div className="flex gap-4">
          <Link href="/login" className="relative underline-animation">
            LOGIN
          </Link>
          <Link href="/register" className="relative underline-animation">
            REGISTER
          </Link>
        </div>
      </div>
      <div className="h-screen flex flex-col justify-center items-center">
        <Image src={logo} width="auto" height="auto" />
      </div>
      <div className="absolute bottom-0 h-fit opacity-20">
        <Wave />
      </div>
    </main>
  );
}
