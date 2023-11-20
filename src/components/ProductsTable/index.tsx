import React, {Key, useCallback, useContext, useEffect, useState} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip, useDisclosure,
} from "@nextui-org/react";
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";
import useTranslation from "../../hooks/useTranslation";
import CreateModal from "../Modal";
import {CreateProductForm} from "../forms/create-product-form";
import toast from "react-hot-toast";
import axios from "axios";
import {useRecoilState} from "recoil";
import {categoriesState} from "../../store/atoms/categories";

type Product = {
    _id: string;
    title: string;
    description: string;
    price: number;
}

export default function ProductsTable({
                                          products,
                                          category
                                      }) {

    const {t, locale} = useTranslation();
    const {
        isOpen: isEditProductModalOpen,
        onOpen: onEditProductModalOpen,
        onOpenChange: onEditProductModalOpenChange
    } = useDisclosure();
    const {
        isOpen: isDeleteProductModalOpen,
        onOpen: onDeleteProductModalOpen,
        onOpenChange: onDeleteProductModalOpenChange
    } = useDisclosure();

    const [categories, setCategories] = useRecoilState(categoriesState);

    const [editProduct, setEditProduct] = useState<Product>(null);
    const [deleteProduct, setDeleteProduct] = useState<Product>(null);

    const deleteProductHandler = async (productId: string) => {
        try {
            const data: any = await axios.delete("/api/product",
                {
                    data: {
                        categoryID: category._id,
                        productID: productId
                    }
                });
            toast.success("Product deleted successfully!");
            setCategories((prev) => {
                const updatedCat = data.data.data;
                const newCategories = prev.map((cat) => {
                    if (cat._id === updatedCat._id) {
                        return updatedCat;
                    }
                    return cat;
                });
                return newCategories;
            });

        } catch (error) {
            console.error(error);
            toast.error("Error deleting product!");
        }
        setDeleteProduct(null);
    };

    const [renderedProducts, setRenderedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        // if (!products?.length) return null;

        const newProducts = products?.map((product: Product) => {
                return {
                    ...product,
                    title: product.title[locale],
                    description: product.description[locale],
                };
            }
        );
        setRenderedProducts(newProducts);
    }, []);

    useEffect(() => {
        if (locale) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000);

            const newProducts = products?.map((product: Product) => {
                    return {
                        ...product,
                        title: product.title[locale],
                        description: product.description[locale],
                    };
                }
            );
            setRenderedProducts(newProducts);
        }
    }, [locale, editProduct, deleteProduct]);

    const columns = [
        {name: "Title", uid: "title"},
        {name: "Price", uid: "price"},
        {name: "Description", uid: "description"},
        {name: "Actions", uid: "actions"},
    ];

    const renderCell = useCallback((product: Product, columnKey: Key) => {
        const cellValue = product[columnKey as keyof Product];
        console.log("cellValue", cellValue);
        switch (columnKey) {
            case "title":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                    </div>
                );
            case "price":
                return (
                    <Chip className="capitalize" color="success" size="sm" variant="flat">
                        {cellValue} €
                    </Chip>
                );
            case "description":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {cellValue}
                        </p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Edit product">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => {
                        setEditProduct(product);
                        setTimeout(() => {
                            onEditProductModalOpenChange();
                        }, 100);
                    }}>
                <EditIcon/>
              </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete product">
              <span className="text-lg text-danger cursor-pointer active:opacity-50"
                    onClick={() => {
                        setDeleteProduct(product);
                        setTimeout(() => {
                            onDeleteProductModalOpen();
                        }, 100);
                    }}
              >
                <DeleteIcon/>
              </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [locale]);

    return (
        <>
            {
                deleteProduct ?
                    <CreateModal
                        isOpen={isDeleteProductModalOpen}
                        onOpenChange={onDeleteProductModalOpenChange}
                        modalTitle="Delete product"
                        modalBody={`Are you sure you want to delete ${deleteProduct?.title}?`}
                        onConfirm={async () => {
                            await deleteProductHandler(deleteProduct._id);
                            setDeleteProduct(null);
                        }}
                    />
                    : null
            }
            {
                editProduct ?
                    <CreateModal
                        isOpen={isEditProductModalOpen}
                        onOpenChange={onEditProductModalOpenChange}
                        modalTitle="Edit product details"
                        footer={false}
                        modalBody={
                            <CreateProductForm category={category}
                                               defaultValues={
                                                   category?.products?.find((product: Product) => product?._id === editProduct?._id)
                                               }
                                               closeModal={() => {
                                                   onEditProductModalOpenChange();
                                                   setEditProduct(null);
                                               }}/>
                        }

                    />
                    : null
            }

            <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column?.uid} align={column?.uid === "actions" ? "center" : "start"}>
                            {column?.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={renderedProducts}
                >
                    {(item) => {
                        return (
                            <TableRow
                                key={item._id as string}
                            >
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        );
                    }}
                </TableBody>
            </Table>
        </>
    );
}
