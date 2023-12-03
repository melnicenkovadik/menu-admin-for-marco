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
                                    <span>{t('noProductsInCategory')}</span>
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
    const {t} = useTranslation();
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

    const [, setCategories] = useRecoilState(categoriesState);

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
                return newCategories;
            });
            toast.success(t('categoryDeleted'));
        } catch (error) {
            console.error(error);
            toast.error(t('errorDeletingCategory'));
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
                    return newCategories;
                }
            );
            toast.success(t('categoryDeleted'));
        } catch (error) {
            console.error(error);
            toast.error(t('errorDeletingCategory'));
        }
    };
    const editCategoryHandler = () => {
        onEditModalOpen();
    };

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
                        {t('addNewProduct')}
                    </DropdownItem>

                    <DropdownItem
                        key="edit"
                        onClick={editCategoryHandler}>
                        {t('editCategory')}
                    </DropdownItem>

                    <DropdownItem
                        onClick={onDeleteModalOpen}
                        key="delete" className="text-danger" color="danger">
                        {t('deleteCategory')}
                    </DropdownItem>
                    <DropdownItem
                        onClick={onDeleteAllModalOpen}
                        key="deleteAll" className="text-danger" color="danger">
                        {t('deleteAllProductsInCategory')}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <CreateModal
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalOpenChange}
                modalTitle={t('deleteCategory')}
                modalBody={t('areYouSureYouWantToDeleteThisCategory')}
                onConfirm={deleteCategoryHandler}
            />
            <CreateModal
                isOpen={isDeleteAllModalOpen}
                onOpenChange={onDeleteAllModalOpenChange}
                modalTitle={t('deleteAllProductsInCategory')}
                modalBody={t('areYouSureYouWantToDeleteAllProductsInThisCategory')}
                onConfirm={deleteAllProductsCategoryHandler}
            />
            <CreateModal
                isOpen={isEditModalOpen}
                onOpenChange={onEditModalOpenChange}
                modalTitle={t('editCategory')}
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
                modalTitle={t('addNewProduct')}
                footer={false}
                modalBody={
                    <CreateProductForm category={category} closeModal={onAddProductModalOpenChange}/>
                }

            />
        </>
    );
}

export default CategoryList;
