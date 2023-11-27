import { ImageContainer, ProductContainer, ProductDetails } from "@/src/styles/pages/product"
import Image from "next/image"
import { useRouter } from "next/router"

const Product = () => {
  const { query } = useRouter()
  return (
    <ProductContainer>
      <ImageContainer>
        {/* <Image > */}
      </ImageContainer>
      <ProductDetails>
        <h1>Camiseta X</h1>
        <span>R$ 79,90</span>

        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet itaque nemo a quibusdam unde repellendus, aperiam fuga. Quia quisquam, animi reprehenderit beatae, dolor sequi voluptatum unde, iure modi magnam corrupti.</p>

        <button>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export default Product
