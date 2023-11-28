import React from 'react';
import { ImageContainer, SuccessContainer } from '../styles/pages/success';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { stripe } from '../lib/stripe';
import Stripe from 'stripe';
import Image from 'next/image';
import Head from 'next/head';

interface SuccessProps {
  customerName: string
  product: {
    name: string
    imageUrl: string
  }
}

const Success = ({customerName, product}: SuccessProps) => {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>
        <meta name='robots' content='noindex' />
      </Head>
      <SuccessContainer>
        <h1>Compra efetuada!</h1>

        <ImageContainer>
          <Image src={product.imageUrl} alt='' width={120} height={110} />
        </ImageContainer>

        <p>
          Uhuul <strong>{customerName}</strong>, sua <strong>{product.name}</strong> the Limits já está a caminho da sua casa.
        </p>

        <Link href='/'>
          Voltar ao catalogo
        </Link>
      </SuccessContainer>
    </>
  );
}


export default Success


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const rawSessionId  = query.session_id

  if (!rawSessionId) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const sessionId = String(rawSessionId)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details?.name

  const {name, images} = session.line_items?.data[0].price?.product as Stripe.Product

  return {
    props: {
      customerName,
      product: {
        name,
        imageUrl: images[0]
      }
    }
  }
}
