import Image from "next/image";
import wachtLogo from "@/public/Wacht.png";

export function Logo() {
    return (
        <span className="inline-flex items-center gap-2.5 text-fd-foreground">
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/90 shadow-sm">
                <Image
                    src={wachtLogo}
                    alt="Wacht"
                    width={18}
                    height={18}
                    className="size-[15px] object-contain"
                />
            </span>
            <span className="text-[13px] font-medium leading-none tracking-tight">Wacht</span>
        </span>
    );
}
