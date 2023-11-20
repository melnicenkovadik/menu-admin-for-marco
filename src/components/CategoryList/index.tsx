"use client";
import {Accordion, AccordionItem, Chip, useDisclosure} from "@nextui-org/react";
import React, {FC} from "react";
import useTranslation from "../../hooks/useTranslation";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import CreateModal from "../Modal";
import toast from "react-hot-toast";
import {CategoryForm} from "../forms/create-cat-form";
import Image from "next/image";
import {CreateProductForm} from "../forms/create-product-form";
import ProductsTable from "../ProductsTable";
import {useRecoilState} from "recoil";
import {categoriesState} from "../../store/atoms/categories";
import axios from "axios";

interface ICategoryList {
    loading?: boolean;
    error?: any;
    categories?: any;
}

const CategoryList: FC<ICategoryList> = ({categories}) => {

    const {t, locale} = useTranslation();
    return (
        <div className="flex flex-col gap-3 md:gap-6">
            <Accordion selectionMode="multiple">
                {categories.map((category: any, index: number) => (
                    <AccordionItem
                        key={index}
                        aria-label={category?.categoryName?.[locale]}
                        subtitle={
                            <p className="flex">
                                <span className="flex-1">{category?.categoryDescription?.[locale]}</span>
                            </p>
                        }
                        title={
                            <div className="w-full flex flex-row justify-start items-center gap-2 md:gap-2">
                                <DropdownCategoryMenu category={category}/>
                                <span className="flex-1">{category?.categoryName?.[locale]}</span>
                            </div>
                        }
                    >
                        {
                            category?.products?.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    <ProductsTable
                                        products={category?.products}
                                        category={category}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-row justify-center items-center">
                                    <span>No products in this category</span>
                                </div>
                            )

                        }

                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};


function DropdownCategoryMenu({category}) {
    const categoryID = category._id;
    const {t, locale} = useTranslation();
    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onOpenChange: onDeleteModalOpenChange
    } = useDisclosure();
    const {
        isOpen: isDeleteAllModalOpen,
        onOpen: onDeleteAllModalOpen,
        onOpenChange: onDeleteAllModalOpenChange
    } = useDisclosure();
    const {isOpen: isEditModalOpen, onOpen: onEditModalOpen, onOpenChange: onEditModalOpenChange} = useDisclosure();
    const {
        isOpen: isAddProductModalOpen,
        onOpen: onAddProductModalOpen,
        onOpenChange: onAddProductModalOpenChange
    } = useDisclosure();


    const [categories, setCategories] = useRecoilState(categoriesState);

    console.log("categorycategory", category);
    const deleteCategoryHandler = async () => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL +  `/api/categories`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({categoryID}),
            });
            const data = await res.json();
            const deletedId = data?.data;
            setCategories((prev) => {
                const newCategories = prev.filter((cat) => cat._id !== deletedId);
                console.log("deleteCategoryHandler newCategories", newCategories);
                return newCategories;
            });
            toast.success("Category deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Error deleting category!");
        }
    };
    const deleteAllProductsCategoryHandler = async () => {
        try {
            const updatedCat = await axios.put(process.env.NEXT_PUBLIC_API_URL +  `/api/categories`, {
                categoryID: categoryID,
                newCategory: {
                    categoryName: {
                        en: category.categoryName.en,
                        ua: category.categoryName.ua,
                        it: category.categoryName.it,
                    },
                    categoryDescription: {
                        en: category.categoryDescription.en,
                        ua: category.categoryDescription.ua,
                        it: category.categoryDescription.it,
                    },
                    products: [],
                }
            });
            const data = updatedCat?.data.data;
            setCategories((prev) => {
                    const newCategories = prev.map((cat) => {
                        if (cat._id === data._id) {
                            return data;
                        }
                        return cat;
                    });
                    console.log("deleteAllProductsCategoryHandler newCategories", newCategories);
                    return newCategories;
                }
            );
            toast.success("Category deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Error deleting category!");
        }
    };
    const editCategoryHandler = () => {
        onEditModalOpen();
    };
    console.log("category", category);
    return (
        <>
            <Dropdown backdrop="blur">
                <DropdownTrigger>
                    <Chip
                        className="flex flex-row justify-center items-center gap-1 hover:bg-gray-600 hover:cursor-pointer rounded-full hover:shadow-md transition-all duration-300">
                        <Image
                            style={{
                                pointerEvents: "none",
                            }}
                            src="/svg/pick.svg" width={15} height={15} alt="dropdown open"/>
                    </Chip>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Static Actions">
                    <DropdownItem
                        className="text-primary"
                        onClick={onAddProductModalOpenChange}
                        key="new">
                        Add new product
                    </DropdownItem>

                    <DropdownItem
                        key="edit"
                        onClick={editCategoryHandler}>
                        Edit category
                    </DropdownItem>

                    <DropdownItem
                        onClick={onDeleteModalOpen}
                        key="delete" className="text-danger" color="danger">
                        Delete category
                    </DropdownItem>
                    <DropdownItem
                        onClick={onDeleteAllModalOpen}
                        key="deleteAll" className="text-danger" color="danger">
                        Delete all products in category
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <CreateModal
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalOpenChange}
                modalTitle="Delete category"
                modalBody="Are you sure you want to delete this category?"
                onConfirm={deleteCategoryHandler}
            />
            <CreateModal
                isOpen={isDeleteAllModalOpen}
                onOpenChange={onDeleteAllModalOpenChange}
                modalTitle="Delete category"
                modalBody="Are you sure you want to delete this category?"
                onConfirm={deleteAllProductsCategoryHandler}
            />
            <CreateModal
                isOpen={isEditModalOpen}
                onOpenChange={onEditModalOpenChange}
                modalTitle="Edit category"
                footer={false}
                modalBody={
                    <CategoryForm defaultValues={category} closeModal={() => {
                        onEditModalOpen();
                    }}/>
                }
            />
            <CreateModal
                isOpen={isAddProductModalOpen}
                onOpenChange={onAddProductModalOpenChange}
                modalTitle="Add new product"
                footer={false}
                modalBody={
                    <CreateProductForm category={category} closeModal={onAddProductModalOpenChange}/>
                }

            />
        </>
    );
}

export default CategoryList;
