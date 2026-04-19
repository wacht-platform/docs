import Image from "next/image";

export function Logo() {
    return (
        <span className="inline-flex items-center gap-2 text-fd-foreground">
            <span className="flex size-7 items-center justify-center rounded-full bg-fd-accent">
                <Image
                    src="/Wacht.png"
                    alt="Wacht"
                    width={20}
                    height={20}
                    className="size-5 object-contain"
                />
            </span>
            <span className="text-sm font-medium leading-none">Wacht</span>
        </span>
    );
}
