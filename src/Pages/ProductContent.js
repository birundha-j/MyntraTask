import react, { useEffect, useState } from "react";
import MyntraIcon from '../Images/myntra.png' ;
import { connect, useDispatch } from 'react-redux'
import { getAllProducts } from "../ReduxThunk/Action/ProductDetailsAction";
import {  Space, Radio, Checkbox } from 'antd';
import { Icons,CheckedProduct,CheckedBrand,CheckedPrice,Genders,Filtertype} from './ArrayList';
import "./ProductContent.css";

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
 }

function ProductContent(props){
    const [productDetails,setProductDetails] = useState([])
    const [dupProductDetails,setDupProductDetails] = useState([])
    const [loader, setLoader] = useState(true)
    const [gendervalue, setGenderValue] = useState(0);
    const [showHeart, setShowHeart] = useState([])
    const [selectProductList, setSelectProductList] = useState([])
    const [searchText, setSearchText] = useState([]);
    const [productChecked, setproductChecked] = useState([]);
    const [brandChecked, setBrandChecked] = useState([]);
    const [pricevalue, setPricevalue] = useState(0);
    const [refresh, setrefresh] = useState(false);
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getAllProducts())
      },[])

      useEffect(()=>{
          if(props.getAllProducts != undefined){
              if(props.getAllProducts && props.getAllProducts.products){
                setLoader(false)
              }
            setProductDetails(props.getAllProducts && props.getAllProducts.products)
            setDupProductDetails(props.getAllProducts && props.getAllProducts.products)
          }
      },[props.getAllProducts])

      useEffect(()=>{
        if(productDetails && productDetails.length === 0){
            setProductDetails(dupProductDetails)
        }
      },[productDetails])


    const genderOnChange = (event,filter_key)=> {
        let choose_val = event
        if(filter_key == "gender"){
            setGenderValue(choose_val);
            requestSearch(Genders[choose_val-1].gender)
        }
        if(filter_key == "price"){
            setPricevalue(choose_val);
            requestPriceSearch(CheckedPrice[choose_val-1])
        }
      };

      const requestPriceSearch = (searchValue) => { 
         const filteredRows = productDetails.filter((row) => {
             if(searchValue.priceTo == 4000 ? row.price > searchValue.priceTo: row.price > searchValue.priceFrom && row.price < searchValue.priceTo){
                return Object.keys(row).some((field) => {
                    if(field !== "landingPageUrl" && field !== "searchImage"){
                      return row
                       }
                   });
             }
         });
         setProductDetails(filteredRows);
      };

      const changeAddHeart = (data, id) => {
        if (!showHeart.includes(id)) {
          selectProductList.push(data)
          setShowHeart([...showHeart, id])
        } else {
          let filterList = selectProductList.filter((li) => li !== data)
          let showList = showHeart.filter((it) => it !== id)
          setSelectProductList(filterList)
          setShowHeart(showList)
        }
      }

      const onchangeSearch =(val)=>{
          if(val == ""){
            setGenderValue(0)
            requestSearch(val) 
            setproductChecked([])
            setBrandChecked([])
          }
        setSearchText(val)
      }

      const handleKeyDown = e =>{
        if (e.key === 'Enter') {
            requestSearch(searchText)
            setGenderValue(0)
            setproductChecked([])
            setSelectProductList([])
            setShowHeart([])
            setBrandChecked([])
          }
      }

      const requestSearch = (searchValue) => { 
       if(searchValue == ""){
        setProductDetails(dupProductDetails);
       }else{
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = productDetails.filter((row) => {
           return Object.keys(row).some((field) => {
            if(field !== "landingPageUrl" && field !== "searchImage"){
              return searchRegex.test(row[field].toString());
               }
           });
        });
        setProductDetails(filteredRows);
       }
     };

     const handleSortChange = (sort_val)=>{
         const sortingRows = productDetails.sort((lowrow,highrow) => {
                  return sort_val == 1 ?Number(lowrow.price) - Number(highrow.price): Number(highrow.price) - Number(lowrow.price);
         });
         setrefresh(!refresh)
        setProductDetails(sortingRows);
     }
     
    const handleProductcheck = (e) => {
        if (e.target.checked === true) {
        setproductChecked([...productChecked, Number(e.target.value)])
        searchMultipleProduct([...productChecked, Number(e.target.value)],CheckedProduct)
        } else {
        const selectedAcc = productChecked.filter(a => {
            if (a === Number(e.target.value)) return false;
            return true;
        });
        setproductChecked([...selectedAcc])
        searchMultipleProduct(selectedAcc,CheckedProduct)
        }
    }

    const handlebrandcheck = (e) => {
        if (e.target.checked === true) {
        setBrandChecked([...brandChecked, Number(e.target.value)])
        searchMultipleProduct([...brandChecked, Number(e.target.value)],CheckedBrand)
        } else {
        const selectedAcc = brandChecked.filter(a => {
            if (a === Number(e.target.value)) return false;
            return true;
        });
        setBrandChecked([...selectedAcc])
        searchMultipleProduct(selectedAcc,CheckedBrand)
        }
    }

    const searchMultipleProduct = (checkedList,check_Keys) => { 
        let filter_products = []
        checkedList.filter((Product_key)=>{
            filter_products.push(check_Keys[Product_key].product_name)
        })
        if(filter_products.length == 0){
            setProductDetails(dupProductDetails);
        }else{
            filter_products.filter((products)=>{
            const searchRegex = new RegExp(escapeRegExp(products), 'i');
            const filteredRows=productDetails.filter((row) => {
                return Object.keys(row).some((field) => {
                    if(field !== "landingPageUrl" && field !== "searchImage"){
                    return searchRegex.test(row[field].toString());
                    }
                });
                })
            setProductDetails(filteredRows);
            })
        }
    };
  

    return(
        <div className="productContainer">
            <div className="headerMenu">
                <div className="icon_Space"><img src={MyntraIcon} className="myntra_Icon_View" /></div>
                <div className="menu_space">
                    {Filtertype.map((fil_type)=>{
                    return <div>{fil_type.type}</div>
                    })}
                </div>
                <div className="search_space">
                <div class="wrapper">
                    <div class="search-icon" >🔎︎</div>
                    <input class="search" placeholder="Search for products, brand and more" type="text" onChange= {(event) => onchangeSearch(event.target.value)} onKeyDown={handleKeyDown} />
                </div>  
                 </div>
                <div className="profile_space">
                    {Icons.map((iconsView,index)=>{
                        return(
                        <div>
                            <div className="watch_listView">
                                <div>{iconsView.icon}</div>
                                {selectProductList.length>0 && index == 1  && <div className="list_count">{selectProductList.length}</div>}
                            </div>
                            <div className="iconName">{iconsView.name}</div>
                        </div>
                        )
                    })}
                </div>
            </div>
            <div className="filter_sort">
                <div className="filter_Show">FILTERS</div>
                <div className="sort_Show">
                    <div className="sort_title">Sort by : </div>
                    <select name="sort_price" onChange={(e) => handleSortChange(e.target.value)} id="sort_price" className="form-control">
                            <option value={""}>{"Recommended"}</option>
                            <option value={1}>Low To High</option>
                            <option value={2}>High To Low</option>
                        </select>
                </div>
            </div>
            <div className="content">
                <div className="options_Show">
                    <div className="gender_Choice">
                    <Radio.Group onChange={(e)=>genderOnChange(e.target.value,"gender")} value={gendervalue}>
                        <Space direction="vertical">
                            {Genders.map((gender_type, index)=>{
                                return  <Radio value={index+1}>{gender_type.gender}</Radio>
                            })}
                        </Space>
                    </Radio.Group>
                    </div>
                    <div className="gender_Choice">
                        <div className="title">CATEGORY</div>
                       {CheckedProduct.map((product_type,index)=>{
                           return(
                               <div className="category_check">
                                   <Checkbox checked={productChecked && productChecked.lastIndexOf(Number(index)) >= 0 ? true : false} onChange={(e) => handleProductcheck(e, index)} name={product_type.product_name} value={index} />
                                   <div className="choose_Name">{product_type.product_name + "  "+ product_type.number}</div>
                               </div>
                           )
                       })}
                    </div>
                    <div className="gender_Choice">
                        <div className="title">BRAND</div>
                        {CheckedBrand.map((brand_type,index)=>{
                           return(
                               <div className="category_check">
                                    <Checkbox checked={brandChecked && brandChecked.lastIndexOf(Number(index)) >= 0 ? true : false} onChange={(e) => handlebrandcheck(e, index)} name={brand_type.product_name} value={index} />
                                   <div className="choose_Name">{brand_type.product_name +" " + brand_type.number}</div>
                               </div>
                           )
                       })}
                    </div>
                    <div className="gender_Choice">
                        <div className="title">PRICE</div>
                        <Radio.Group onChange={(e)=>genderOnChange(e.target.value,"price")} value={pricevalue}>
                        <Space direction="vertical">
                            {CheckedPrice.map((price_val,index)=>{
                                return  <Radio className="choose_Name" value={index+1}>{ price_val.priceTo == 4000 ? "Above " +price_val.priceTo :"Rs. "+ price_val.priceFrom + " to "+price_val.priceTo}</Radio>
                            })}
                        </Space>
                    </Radio.Group>
                    </div>
                </div>
                <div className="product_Show">
                {loader && <div className="loader"></div>}
                {productDetails && productDetails.length > 0 && productDetails.map((products,index)=>{
                        return(
                            <div className="product_Container">
                                     <img src={products.searchImage} className="product_Image" />
                                     <div className="movieStar">
                                     <div className="brand_Name">{products.brand}</div>
                                        <div onClick={() => changeAddHeart(products, products.productId)} className={`${showHeart && showHeart.includes(products.productId) ? "fillStar" : "emptyStar"}`}>
                                            {showHeart && showHeart.includes(products.productId) ? "❤" : "♡"}</div>
                                    </div>
                                     <div className="addproduct_Info">{products.additionalInfo}</div>
                                     <div className="price_Show">
                                        <div className="price_view">{"RS." +products.price}</div>
                                        <div className="mrp_view">{"RS." +products.mrp}</div>
                                        <div className="discount_view">{products.discountDisplayLabel}</div>
                                     </div>
                                    
                            </div>
                        )
                    })}
                </div>
            </div>
           
        </div>
    )
}

const mapStateToProps = (state) => (
    { getAllProducts: state.MasterDropdown.getAllProducts}
);

export default connect(mapStateToProps)(ProductContent);