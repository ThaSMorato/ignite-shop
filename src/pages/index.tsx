import Image from "next/image"
import Stripe from "stripe"

import { HomeContainer, Product } from "../styles/pages/home"
import { useKeenSlider } from 'keen-slider/react'
import { stripe } from "../lib/stripe"
import { GetStaticProps } from "next"

import 'keen-slider/keen-slider.min.css'

interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: number
  }[]
}

const Home = ({ products }:HomeProps) => {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  })

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {
        products.map(product => (
            <Product
              href={`/product/${product.id}`}
              key={product.id}
              className="keen-slider__slide"
              prefetch={false}
            >
              <Image src={product.imageUrl} width={520} height={480} alt=''/>
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
        ))
      }
    </HomeContainer>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(({id, name, images, default_price}) => {
    const d_price = default_price as Stripe.Price

    const price = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(d_price.unit_amount! / 100)

    return {
      id,
      name,
      imageUrl: images[0],
      price,
    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2, //2 hours
  }
}
