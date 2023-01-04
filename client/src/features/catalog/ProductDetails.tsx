import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Divider, Grid, TableBody, TableCell, TableContainer, TableRow, Typography, Paper, Table } from "@mui/material"
import axios from "axios";
import { Product } from "../../app/models/product";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data: product } = await axios.get(`http://localhost:5000/api/products/${id}`)
        setProduct(product)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) return <h3>loading</h3>

  if (!product) return <h3>Not product found</h3>

  return (
    <Grid container spacing={6}>
      {/* 1 item a line when screen < sx  */}
      {/* 2 items a line when > sx  */}
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: '100%', height: 'auto' }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">
          {product.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color='secondary'>
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity In Stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default ProductDetails