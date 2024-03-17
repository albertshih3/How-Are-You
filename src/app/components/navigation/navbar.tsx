import Link from 'next/link'; 

export default function Navbar() {
    return (
        <nav className = 'navbar'>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href='/login'>Login</Link>
                </li>
            </ul>
        </nav>
    )
}