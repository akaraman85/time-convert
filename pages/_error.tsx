import { NextPage, NextPageContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'

interface ErrorProps {
  statusCode: number | null
  title?: string
}

const Error: NextPage<ErrorProps> = ({ statusCode, title }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        color: '#333',
      }}
    >
      <Head>
        <title>
          {statusCode
            ? `${statusCode} - ${title || 'Error'}`
            : 'Application Error'}
        </title>
      </Head>

      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#4a5568',
        }}
      >
        {statusCode || 'Error'}
      </h1>

      <p
        style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          lineHeight: '1.6',
        }}
      >
        {statusCode === 404
          ? 'The page you are looking for could not be found.'
          : 'An unexpected error has occurred. Please try again later.'}
      </p>

      <Link
        href='/'
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4f46e5',
          color: 'white',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'background-color 0.2s',
        }}
      >
        Return Home
      </Link>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? (err.statusCode ?? 500) : 404
  return { statusCode }
}

export default Error
