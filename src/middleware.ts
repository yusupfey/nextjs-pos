import { NextRequest, NextResponse } from "next/server";
export function middleware(request:NextRequest){
    const islogin = request.cookies.get('logged_in')
    console.log(islogin);
    console.log('midelwarejalan');
    
    if(!islogin){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next();

}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/master/:path*',
        '/cashier/:path*'
    ]
}