// app/sign-in/[[...sign-in]]/page.tsx
import Background from "@/app/Component/Background";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-[90vh] bg-black w-screen relative"> {/* Added 'relative' to the parent */}
    <Background/>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"> {/* New div for absolute centering */}
        <SignUp />
      </div>
    </div>
  );
}