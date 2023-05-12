import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr .8fr;
    }
    gap: 40px;
    margin-top: 40px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 2px;
    border: 1px solid rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        width: 100px;
        height: 100px;
        img{
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QuantityLabel = styled.label`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 10px;
    }
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

export default function CartPage() {
    const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext)
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);


    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', { ids: cartProducts })
                .then(res => {
                    console.log({ res })
                    setProducts(res.data);
                })
        } else {
            setProducts([])
        }
    }, [cartProducts])

    function moreOfThisProduct(productId) {
        addProduct(productId)
    }

    function lessOfThisProduct(productId) {
        removeProduct(productId)
    }

    async function goToPayment() {
        const res = await axios.post('/api/checkout', {
            name, phoneNumber, email, city, postalCode, address, country, cartProducts,
        })
        if (res.status === 200) {
            setIsSuccess(true)
            clearCart()
        }
    }

    let total = 0;
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price;
    }

    return (
        <>
            <Header />
            <Center>
                {isSuccess ?
                    <ColumnsWrapper>
                        <Box>
                            <h1>Thanks for your order!</h1>
                            <p>We will email you when your order will be sent.</p>
                        </Box>
                    </ColumnsWrapper>
                    :
                    <ColumnsWrapper>
                        <WhiteBox>
                            <h2>Cart</h2>
                            {cartProducts.length <= 0 && (
                                <div>Your cart is empty</div>
                            )}
                            {products.length > 0 && (
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product._id}>
                                                <ProductInfoCell>
                                                    <ProductImageBox>
                                                        <img src={product.images[0].url} alt="" />
                                                    </ProductImageBox>
                                                    {product.title}
                                                </ProductInfoCell>
                                                <td>
                                                    <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                                                    <QuantityLabel>
                                                        {cartProducts.filter(id => id === product._id).length}
                                                    </QuantityLabel>
                                                    <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                                </td>
                                                <td>
                                                    ${cartProducts.filter(id => id === product._id).length * product.price}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>${total}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            )}

                        </WhiteBox>
                        {cartProducts.length > 0 && (
                            <WhiteBox>
                                <h2>Order information</h2>
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    name="name"
                                    onChange={ev => setName(ev.target.value)} />
                                <Input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    name="phoneNumber"
                                    onChange={ev => setPhoneNumber(ev.target.value)} />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    name="email"
                                    onChange={ev => setEmail(ev.target.value)} 
                                    />
                                <CityHolder>
                                    <Input
                                        type="text"
                                        placeholder="City"
                                        value={city}
                                        name="city"
                                        onChange={ev => setCity(ev.target.value)} />
                                    <Input
                                        type="text"
                                        placeholder="Postal Code"
                                        value={postalCode}
                                        name="postalCode"
                                        onChange={ev => setPostalCode(ev.target.value)} />
                                </CityHolder>
                                <Input
                                    type="text"
                                    placeholder="Address"
                                    value={address}
                                    name="address"
                                    onChange={ev => setAddress(ev.target.value)} />
                                <Input
                                    type="text"
                                    placeholder="Country"
                                    value={country}
                                    name="country"
                                    onChange={ev => setCountry(ev.target.value)} />

                                <Button black block
                                    onClick={goToPayment}
                                    disabled={!name || !email || !phoneNumber ? true : false}>
                                    Continue to payment
                                </Button>
                            </WhiteBox>
                        )}
                    </ColumnsWrapper>
                }
            </Center>
        </>
    )
}