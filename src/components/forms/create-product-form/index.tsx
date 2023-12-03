import React from 'react';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { categoriesState } from '../../../store/atoms/categories';
import axios from 'axios';
import { Button, Input } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from '../../../hooks/useTranslation';




export const CreateProductForm = ({ category, defaultValues = null, closeModal = null }: any) => {
    const { t } = useTranslation();

    const createProductSchema = z.object({
      title: z.object({
        en: z.string().nonempty({ message: t('productNameIsRequired') }),
        ua: z.string().nonempty({ message: t('productNameIsRequired') }),
        it: z.string().nonempty({ message: t('productNameIsRequired') }),
      }),
      categoryID: z.string(),
      price: z
        .string()
        .min(0, { message: t('priceMustBeGreaterThan0') })
        .max(100000, { message: t('priceMustBeLessThan10000') }),
      description: z.object({
        en: z.string(),
        ua: z.string(),
        it: z.string(),
      }),
    });

    const isEditMode = !!defaultValues;
    const [, setCategories] = useRecoilState(categoriesState);
    const {
      handleSubmit,
      register,
      reset,
      formState: { errors, isSubmitting, isDirty, isValid },
    } = useForm<z.infer<typeof createProductSchema>>({
      resolver: zodResolver(createProductSchema),
      mode: 'all',
      defaultValues: {
        title: {
          en: defaultValues?.title?.en || '',
          ua: defaultValues?.title?.ua || '',
          it: defaultValues?.title?.it || '',
        },
        categoryID: category._id,
        price: defaultValues?.price || undefined,
        description: {
          en: defaultValues?.description?.en || '',
          ua: defaultValues?.description?.ua || '',
          it: defaultValues?.description?.it || '',
        },
      },
    });

    async function onSubmit(data: z.infer<typeof createProductSchema>) {
      let newProduct = {};
      if (isEditMode) {
        newProduct = {
          title: {
            en: data.title.en,
            ua: data.title.ua,
            it: data.title.it,
          },
          price: data.price,
          description: {
            en: data.description.en,
            ua: data.description.ua,
            it: data.description.it,
          },
          categoryID: category._id,
        };
      } else {
        newProduct = {
          title: {
            en: data.title.en,
            ua: data.title.ua,
            it: data.title.it,
          },
          price: data.price,
          description: {
            en: data.description.en,
            ua: data.description.ua,
            it: data.description.it,
          },
          categoryID: category._id,
        };
      }

      if (isEditMode) {
        const updatedProduct = await axios.put(process.env.NEXT_PUBLIC_API_URL + '/api/product', {
          updatedProduct: newProduct,
          categoryID: category._id,
          productID: defaultValues._id,
        });

        const updatedCategoryData = updatedProduct.data.data;
        setCategories((prev) => {
          const newCategories = prev.map((cat) => {
            if (cat._id === updatedCategoryData._id) {
              return updatedCategoryData;
            }
            return cat;
          });
          return newCategories;
        });

        toast.success(t('productUpdated'));
      } else {
        const updatedCat = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newProduct: newProduct,
            categoryID: category._id,
          }),
        });
        const updatedCatData = await updatedCat.json();
        setCategories((prev) => {
          const updatedCategory = updatedCatData.data;
          const newCategories = prev.map((cat) => {
            if (cat._id === updatedCategory._id) {
              return updatedCategory;
            }
            return cat;
          });
          return newCategories;
        });
        toast.success(t('productCreated'));
      }
      closeModal();
      reset();
    };

    return (
      <form className='w-full flex flex-col gap-3 md:gap-6'
            action=''
            method='POST'
            onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-3 md:gap-6 '>
          <label htmlFor='title' className='text-sm md:text-base font-medium text-gray-700'>
            {t('title')}
          </label>
          <Input isRequired
                 variant='bordered'
                 size='sm'
                 type='text'
                 label={`${t('productTitle')} EN`}
                 placeholder='Product title EN'
                 defaultValue={defaultValues?.title?.en}
                 {...register('title.en')}
          />
          <Input isRequired
                 variant='bordered'
                 size='sm'
                 type='text'
                 label={`${t('productTitle')} UA`}
                 placeholder={`${t('productTitle')} UA`}
                 defaultValue={defaultValues?.title?.ua}
                 {...register('title.ua')}
          />
          <Input isRequired
                 variant='bordered'
                 size='sm'
                 type='text'
                 label={`${t('productTitle')} IT`}
                 placeholder={`${t('productTitle')} IT`}
                 defaultValue={defaultValues?.title?.it}
                 {...register('title.it')}
          />
        </div>

        <div className='flex flex-col gap-3 md:gap-6 '>
          <label htmlFor='title' className='text-sm md:text-base font-medium text-gray-700'>
            {t('priceInEUR')}
          </label>
          <Input isRequired
                 variant='bordered'
                 size='sm'
                 type='number'
                 label={t('price')}
                 placeholder={t('price')}
                 defaultValue={defaultValues?.price}
                 {...register('price')}
          />
        </div>

        <div className='flex flex-col gap-3 md:gap-6 '>
          <label htmlFor='title' className='text-sm md:text-base font-medium text-gray-700'>
            {t('description')}
          </label>
          <Input
            variant='bordered'
            size='sm'
            type='text'
            label={`${t('productDescription')} EN`}
            placeholder={`${t('productDescription')} EN`}
            defaultValue={defaultValues?.description?.en}
            {...register('description.en')}
          />
          <Input
            variant='bordered'
            size='sm'
            type='text'
            label={`${t('productDescription')} UA`}
            placeholder={`${t('productDescription')} UA`}
            defaultValue={defaultValues?.description?.ua}
            {...register('description.ua')}
          />
          <Input
            variant='bordered'
            size='sm'
            type='text'
            label={`${t('productDescription')} IT`}
            placeholder={`${t('productDescription')} IT`}
            defaultValue={defaultValues?.description?.it}
            {...register('description.it')}
          />
        </div>

        <div className='flex flex-row gap-3 items-center justify-start'>
          {
            closeModal && (
              <Button
                className='max-w-xs p-4 mb-5'
                color='danger' variant='light' onPress={() => {
                closeModal(false);
              }}>
                {t('close')}
              </Button>
            ) || null
          }
          <Button size='sm'
                  type='submit'
                  disabled={!isDirty || !isValid || isSubmitting}
                  className='max-w-xs p-4 mb-5'
                  color={isDirty && isValid ? 'primary' : 'default'}
          >
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </div>
      </form>
    );
  }
;
