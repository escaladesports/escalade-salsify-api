require('envdotjs').load()
// import config from '../config.json'
import path from 'path'
// import XLSX from 'xlsx'
import fs from 'fs-extra'
import fetch from 'isomorphic-fetch'
// import axios from 'axios'
// import { connectToDatabase } from '../utils/db'
// import Sheet from '../models/Sheet'
import camelCase from 'camelcase'
import brandList from '../list.json'

const listToJSON = () => {
  const listPerPage = 250
  const options = {
    baseUrl: `https://app.salsify.com/api/orgs/${process.env.SALSIFY_ORG_ID}`,
    url: `https://app.salsify.com/api/orgs/${
      process.env.SALSIFY_ORG_ID
    }/lists?per_page=${listPerPage}`,
    headers: {
      Authorization: `Bearer ${process.env.SALSIFY_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }

  return new Promise(async (resolve, reject) => {
    let updatedList = []

    const res = await fetch(options.url, {
      method: 'GET',
      headers: options.headers
    })
      .then(res => res.json())
      .catch(err => reject(err))

    if (res) {
      const { lists, meta } = res
      updatedList = updatedList.concat(lists)
      const { total_entries, per_page, current_page } = meta
      const pages = Math.ceil(total_entries / per_page)
      let i
      if (pages > 1) {
        for (i = current_page + 1; i < pages; i++) {
          const response = await fetch(`${options.url}&page=${i}`, {
            method: 'GET',
            headers: options.headers
          })
            .then(response => response.json())
            .catch(err => reject(err))
          if (response) {
            updatedList = updatedList.concat(response.lists)
          }
        }
      }
    }
    let productList = []
    // grab list that we want from list.json
    if (updatedList.length > 0) {
      const selectedList = updatedList.filter(l => {
        // replace all spaces/special chars with '-'
        const name = l.name
          .replace(/^\s+|[^\s\w]+|\s+$/g, '')
          .replace(/\s+/g, '-')
          .toLowerCase()
        return brandList.includes(name)
      })
      // Loop through the list and populate products
      selectedList.forEach(async (list, index) => {
        let updatedProducts = []
        const name = list.name
          .replace(/^\s+|[^\s\w]+|\s+$/g, '')
          .replace(/\s+/g, '-')
          .toLowerCase()
        const products = await fetch(
          `${options.baseUrl}/products?filter==list:${
            list.id
          }&per_page=250&view=30478`,
          {
            method: 'GET',
            headers: options.headers
          }
        )
          .then(res => {
            if (res.status === 200) {
              return res.json()
            }
          })
          .catch(err => reject(err))
        products.products.map(product => {
          let updatedProduct = { ...product }
          product.properties.forEach(p => {
            if (p.values.length === 0) {
              return
            }

            let updatedName = camelCase(p.id.replace(/^\s+|[^\s\w]+|\s+$/g, ''))
            switch (p.data_type) {
              case 'digital_asset':
                updatedProduct[updatedName] = p.values.map(value => {
                  const splitArr = value.large_url.split('/')
                  const firstHalf = splitArr.slice(0, splitArr.length - 2)
                  const secondHalf = splitArr.slice(
                    splitArr.length - 1,
                    splitArr.length
                  )
                  const updatedValue = firstHalf.concat(secondHalf).join('/')
                  return updatedValue
                })
                return
              default:
                p.values.length > 1
                  ? (updatedProduct[`${updatedName}Arr`] = p.values.map(
                      value => value.name || value.id
                    ))
                  : updatedName === 'brand'
                    ? (updatedProduct[
                        updatedName
                      ] = p.values[0].name.toLowerCase())
                    : (updatedProduct[updatedName] = p.values[0].name)
                return
            }
          })
          delete updatedProduct['properties']
          updatedProducts.push(updatedProduct)
        })

        const productPages = Math.ceil(
          products.meta.total_entries / products.meta.per_page
        )

        if (productPages > 1) {
          for (let i = products.meta.current_page + 1; i <= productPages; i++) {
            const response = await fetch(
              `${options.baseUrl}/products?filter==list:${
                list.id
              }&per_page=250&view=30478&page=${i}`,
              {
                method: 'GET',
                headers: options.headers
              }
            )
              .then(response => response.json())
              .catch(err => reject(err))
            if (response) {
              response.products.map(product => {
                let updatedProduct = { ...product }
                product.properties.forEach(p => {
                  if (p.values.length === 0) {
                    return
                  }
                  let updatedName = camelCase(
                    p.id.replace(/^\s+|[^\s\w]+|\s+$/g, '')
                  )

                  switch (p.data_type) {
                    case 'digital_asset':
                      updatedProduct[updatedName] = p.values.map(value => {
                        const splitArr = value.large_url.split('/')
                        const firstHalf = splitArr.slice(0, splitArr.length - 2)
                        const secondHalf = splitArr.slice(
                          splitArr.length - 1,
                          splitArr.length
                        )
                        const updatedValue = firstHalf
                          .concat(secondHalf)
                          .join('/')
                        return updatedValue
                      })
                      return
                    default:
                      p.values.length > 1
                        ? (updatedProduct[`${updatedName}Arr`] = p.values.map(
                            value => value.name || value.id
                          ))
                        : updatedName === 'brand'
                          ? (updatedProduct[
                              updatedName
                            ] = p.values[0].name.toLowerCase())
                          : (updatedProduct[updatedName] = p.values[0].name)
                      return
                  }
                })
                delete updatedProduct['properties']
                updatedProducts.push(updatedProduct)
              })
            }
          }
        }
        if (updatedProducts.length === products.meta.total_entries) {
          productList.push(updatedProducts)
          const progress = (
            (productList.length / brandList.length) *
            100
          ).toFixed(2)
          const string = `${progress} %  -  lists completed`
          console.log(`${string}`)
        }
        await fs.outputJson(
          path.resolve(__dirname, `../dist/lists/${name}.json`),
          updatedProducts
        )
        if (productList.length === brandList.length) {
          resolve('success')
        }
      })
    }
  })
}

const runApi = async () => {
  const listRes = await listToJSON().catch(err => {
    console.log(err)
    process.exit(1)
  })
  if (listRes === 'success') {
    console.log('LISTS CREATED')
    process.exit(0)
  } else {
    console.log(listRes)
    process.exit(1)
  }
}

runApi()
