import { signOut } from "@/auth"

export default function team() {
    return (
        <div className="bg-[rgba(12, 172, 79, 0.50)] flex flex-col">
            <button>
                Dashboard
            </button>
            <button>
                Team Details
            </button>
            <button>
                Settings
            </button>
            <form action={async () => {
                "use server";
                await signOut({redirectTo: "/"})
            }}
            >
                <button type="submit">
                    Log Out
                </button>
            </form>
        </div>
    )
}