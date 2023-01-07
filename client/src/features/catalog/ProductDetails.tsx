import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Divider, Grid, TableBody, TableCell, TableContainer, TableRow, Typography, Table } from "@mui/material"
import { Product } from "../../app/models/product";
import requestAgent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    requestAgent.Catalog.getProductDetailL(+id!).then(product => setProduct(product)).catch(error => console.log(error.response)).finally(() => setLoading(false))

  }, [id])

  if (loading) return <LoadingComponent message="loading product" />

  if (!product) return <NotFound />

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