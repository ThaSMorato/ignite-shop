import { stripe } from "@/src/lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "@/src/styles/pages/product"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Stripe from "stripe"

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
  }
}

const Product = ({product}: ProductProps) => {
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt={product.name} />
      </ImageContainer>
      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export default Product



export const getStaticProps: GetStaticProps<any, {id: string}> = async ({ params }) => {
  const productId = params!.id;

  const {id, name, default_price, images, description} = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const d_price = default_price as Stripe.Price

    const price = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(d_price.unit_amount! / 100)

    const product =  {
      id,
      name,
      imageUrl: images[0],
      price,
      description,
    }

  return {
    props: { product },
    revalidate: 60 * 60 * 1 //1 hour
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}
