import { NextRequest, NextResponse } from 'next/server';
// import puppeteer from 'puppeteer-core';
// import os from 'os';
// import chromium from '@sparticuz/chromium';

export const dynamic = 'force-dynamic';

// function getLocalChromePath() {
//   const platform = os.platform();
//   if (platform === 'win32') return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
//   if (platform === 'darwin') return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
//   return '/usr/bin/google-chrome';
// }

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // let browser;
    try {
        // let launchOptions: any = {
        //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // };
        // // if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        // //     // Serverless (Vercel, AWS Lambda, etc) with @sparticuz/chromium
        // //     launchOptions = {
        // //         args: chromium.args,
        // //         executablePath: await chromium.executablePath(),
        // //         headless: chromium.headless,
        // //         defaultViewport: chromium.defaultViewport,
        // //     };
        // // } else {
        // //     // Local/dev
        // //     launchOptions.executablePath = getLocalChromePath();
        // //     launchOptions.headless = true;
        // // }
        // browser = await puppeteer.launch(launchOptions);
        // const page = await browser.newPage();
        // await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        // const screenshot = await page.screenshot({ type: 'png' });
        // await browser.close();

        // return new NextResponse(screenshot, {
        //     status: 200,
        //     headers: {
        //         'Content-Type': 'image/png',
        //         'Cache-Control': 'no-store',
        //     },
        // });
    } catch (error) {
        console.log(error)
        // if (browser) await browser.close();
        return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
    }
}