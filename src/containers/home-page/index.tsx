import React from 'react';
import { useRecoilValue } from 'recoil';
import { getCategoriesState } from '../../store/selectors/categories';
import useTranslation from '../../hooks/useTranslation';
import { Accordion, AccordionItem } from '@nextui-org/react';

const HomaPageContainer = (props) => {
  const { setLocale, locales, locale } = useTranslation();
  const categories = useRecoilValue(getCategoriesState);
  console.log('categories', categories);
  // product example {
  //     "_id": "655baddca927d117f7b0faf0",
  //     "categoryName": {
  //         "en": "111111",
  //         "ua": "111111",
  //         "it": "111111"
  //     },
  //     "categoryDescription": {
  //         "en": "111111",
  //         "ua": "111111",
  //         "it": "111111"
  //     },
  //     "products": [
  //         {
  //             "title": {
  //                 "en": "aaaaaa",
  //                 "ua": "dddd",
  //                 "it": "dddd"
  //             },
  //             "price": "2222",
  //             "description": {
  //                 "en": "dddd",
  //                 "ua": "dddd",
  //                 "it": "dddd"
  //             },
  //             "categoryID": "655baddca927d117f7b0faf0",
  //             "_id": "655bd645349642ae53c7dbb6"
  //         }
  //     ]
  // }


  return (
    // use tailwindcss for styling
    <>
      <div className='w-100'>
        <Accordion
          selectionMode='multiple'
          defaultSelectedKeys='all'
        >
          {
            categories.map((category) => (
              <AccordionItem
                key={category._id}
                aria-label={category.categoryName[locale]}
                title={
                  <div className='text-l'>
                    {category.categoryName[locale]}
                  </div>
                }
                subtitle={category.categoryDescription[locale] || undefined}
                value={category._id}
                autoFocus
              >
                {
                  category.products.map((product, index) => (
                    <div
                      key={product._id}
                      className={`flex justify-between items-start justify-center border-b py-4 ${index === category.products.length - 1 ? 'border-b-0' : ''} gap-2 px-1`}
                    >
                      <div className='flex flex-col'>
                        <div className='text-medium'>
                          {product.title[locale]}
                        </div>
                        {/*cursive font*/}
                        <div className='text-small text-gray-600 italic'>
                          daskjhdksfhkjashkfkajsfhskadaskjhdksfhkjashkfkajsfhskadaskjhdksfhkjashkfkajsfhskadaskjhdksfhkjashkfkajsfhskadaskjhdksfhkjashkfkajsfhska
                          {product.description[locale]}
                        </div>
                      </div>
                      <div className='min-w-fit text-medium'>
                        {Number(product.price).toFixed(2)} €
                      </div>
                    </div>
                  ))}
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </>
  );
};

export default HomaPageContainer;
