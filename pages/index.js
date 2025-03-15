import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie || '';
  const { token } = parse(cookies);

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    } catch (error) {
    }
  }

  return {
    props: {},
  };
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Head>
        <title>UptimeGuard - Website Monitoring Made Simple</title>
        <meta
          name="description"
          content="Monitor your website's uptime, performance, and receive instant alerts when issues occur."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4V2M12 22V20M4 12H2M22 12H20M19.778 19.778L18.364 18.364M19.778 4.222L18.364 5.636M4.222 19.778L5.636 18.364M4.222 4.222L5.636 5.636"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">UptimeGuard</span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-xs font-medium">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-xs font-medium">
                How It Works
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-xs font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-xs font-medium rounded-md">
                Sign Up Free
              </Link>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link href="#features" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
                Features
              </Link>
              <Link href="#how-it-works" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
                How It Works
              </Link>
              <Link href="/login" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
                Login
              </Link>
              <Link
                href="/signup"
                className="m-auto block w-19/20 text-center px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-12 md:pb-16 lg:w-full lg:pb-20 xl:pb-24">
            <main className="mt-8 mx-auto max-w-5xl px-4 sm:mt-10 sm:px-6 md:mt-12 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl md:text-5xl">
                  <span className="block">Know when your</span>
                  <span className="block text-blue-600">website is down</span>
                </h1>
                <p className="mt-3 text-xs text-gray-500 sm:mt-4 sm:text-base sm:max-w-xl sm:mx-auto md:mt-5 md:text-xs lg:mx-0 lg:max-w-xs">
                  Monitor your website's uptime, get instant alerts when issues occur, and analyze performance with detailed reports and visualizations.
                </p>
                <div className="mt-4 sm:mt-6 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Get started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="#features"
                      className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-48 w-full object-cover sm:h-56 md:h-64 lg:w-full lg:h-full"
            src="https://unsplash.com/photos/Q1p7bh3SHj8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTZ8fHNlcnZlcnxlbnwwfHx8fDE3NDE3MTExOTl8MA&force=true"
            alt="Dashboard preview"
          />
        </div>
      </div>

      <div id="features" className="py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-3xl font-bold text-gray-900 sm:text-4xl sm:tracking-tight">
              Everything you need to monitor your websites
            </p>
            <p className="max-w-xl mt-4 mx-auto text-lg text-gray-500">
              Comprehensive monitoring tools to ensure your websites are always up and running at peak performance.
            </p>
          </div>
          <div className="mt-12">
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6">
              <div className="relative">
                <div className="relative p-4 bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  <div className="relative">
                    <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-base font-medium text-gray-900">Real-time Monitoring</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Monitor your websites 24/7 with customizable check intervals as low as 1 minute.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative p-4 bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  <div className="relative">
                    <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-base font-medium text-gray-900">Instant Alerts</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Get notified immediately when your website goes down through multiple channels.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative p-4 bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  <div className="relative">
                    <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-base font-medium text-gray-900">Detailed Analytics</p>
                    <p className="mt-1 text-sm text-gray-500">
                      View comprehensive uptime statistics and response time graphs for all your websites.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="relative p-4 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <div className="relative">
                <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="mt-3 text-base font-medium text-gray-900">Incident History</p>
                <p className="mt-1 text-sm text-gray-500">
                  Track all downtime incidents with detailed information including duration, status codes, and reasons.
                </p>
              </div>
            </div>
            <div className="relative p-4 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <div className="relative">
                <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="mt-3 text-base font-medium text-gray-900">Customizable Monitoring</p>
                <p className="mt-1 text-sm text-gray-500">
                  Configure monitoring settings including HTTP methods, headers, expected status codes, and timeouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="how-it-works" className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">How It Works</h2>
            <p className="mt-1 text-3xl font-bold text-gray-900 sm:text-4xl sm:tracking-tight">
              Simple, yet powerful monitoring
            </p>
            <p className="max-w-xl mt-4 mx-auto text-lg text-gray-500">
              Get started in minutes and keep track of your websites' performance.
            </p>
          </div>
          <div className="mt-12 lg:grid lg:grid-cols-3 lg:gap-6">
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                <span className="text-base font-bold">1</span>
              </div>
              <div className="mt-4">
                <h3 className="text-base leading-6 font-medium text-gray-900">Create an account</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Sign up for free and create your first monitor in just a few minutes. No credit card required.
                </p>
              </div>
            </div>
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                <span className="text-base font-bold">2</span>
              </div>
              <div className="mt-4">
                <h3 className="text-base leading-6 font-medium text-gray-900">Add your websites</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add the URLs you want to monitor, set your check intervals, and customize monitoring parameters.
                </p>
              </div>
            </div>
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                <span className="text-base font-bold">3</span>
              </div>
              <div className="mt-4">
                <h3 className="text-base leading-6 font-medium text-gray-900">Get notified</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Receive instant alerts when issues are detected and view detailed reports on your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Dashboard</h2>
            <p className="mt-1 text-3xl font-bold text-gray-900 sm:text-4xl sm:tracking-tight">
              Powerful insights at a glance
            </p>
            <p className="max-w-xl mt-4 mx-auto text-lg text-gray-500">
              Our intuitive dashboard gives you all the information you need about your websites' performance.
            </p>
          </div>
          <div className="mt-8 relative">
            <div className="relative rounded-lg shadow-lg overflow-hidden">
              <img
                className="w-full object-cover"
                src="https://unsplash.com/photos/qTEj-KMMq_Q/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzJ8fHNlcnZlcnxlbnwwfHx8fDE3NDE3MTEyMDl8MA&force=true"
                alt="Dashboard preview"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-bold">Comprehensive monitoring dashboard</h3>
                <p className="mt-1 text-sm">
                  Track uptime, response times, and incidents all in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Start monitoring your websites today.</span>
          </h2>
          <div className="mt-6 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Sign up for free
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}