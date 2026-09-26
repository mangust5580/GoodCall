import { useId, useState } from 'react';

import { Button, Tabs, tabId, tabPanelId } from '../../components/ui';
import { ProductDeliveryPayment } from './ProductDeliveryPayment';
import { ProductDescription } from './ProductDescription';
import { ProductReviews } from './ProductReviews';
import { ProductSpecificationList, ProductSpecifications } from './ProductSpecifications';
import { ProductWarranty } from './ProductWarranty';
import { formatPoints } from './productDetailsFormat';
import type { ProductDetailsFixture } from './productDetailsFixtures';

type SectionId = 'description' | 'specifications' | 'reviews' | 'delivery' | 'warranty';

const DEFAULT_SECTION: SectionId = 'description';

interface ProductDetailsSectionsProps {
  readonly product: ProductDetailsFixture;
}

export function ProductDetailsSections({ product }: ProductDetailsSectionsProps) {
  const idBase = useId();
  const [activeSection, setActiveSection] = useState<SectionId>(DEFAULT_SECTION);

  const sections: readonly { readonly id: SectionId; readonly label: string }[] = [
    { id: 'description', label: 'Описание' },
    { id: 'specifications', label: 'Характеристики' },
    { id: 'reviews', label: `Отзывы (${formatPoints(product.reviewCount)})` },
    { id: 'delivery', label: 'Доставка и оплата' },
    { id: 'warranty', label: 'Гарантия' },
  ];

  const keySpecifications = product.specificationGroups.flatMap((group) =>
    group.rows.filter((row) => row.key === true),
  );
  const monthlyPayment = Math.ceil(product.priceValue / product.installmentMonths);

  const panel = (id: SectionId) => {
    switch (id) {
      case 'description':
        return (
          <ProductDescription description={product.description} image={product.descriptionImage} />
        );
      case 'specifications':
        return <ProductSpecifications groups={product.specificationGroups} />;
      case 'reviews':
        return (
          <ProductReviews
            rating={product.rating}
            reviewCount={product.reviewCount}
            reviews={product.reviews}
          />
        );
      case 'delivery':
        return (
          <ProductDeliveryPayment
            delivery={product.services.filter((service) => service.kind === 'delivery')}
            installmentMonths={product.installmentMonths}
            monthlyPayment={monthlyPayment}
            paymentMethods={product.paymentMethods}
          />
        );
      case 'warranty':
        return (
          <ProductWarranty
            image={product.warrantyImage}
            items={product.trust}
            supportHours={product.supportHours}
            supportPhone={product.supportPhone}
            supportPhoneHref={product.supportPhoneHref}
          />
        );
    }
  };

  const showSpecifications = () => {
    setActiveSection('specifications');
    document.getElementById(tabId(idBase, 'specifications'))?.focus();
  };

  return (
    <section aria-label="Подробнее о товаре" className="product-sections">
      <div className="product-sections__tabs">
        <Tabs
          activeId={activeSection}
          idBase={idBase}
          items={sections}
          label="Разделы о товаре"
          onChange={(id) => {
            const next = sections.find((section) => section.id === id);

            if (next !== undefined) {
              setActiveSection(next.id);
            }
          }}
        />
      </div>

      <div className="product-sections__layout">
        <div className="product-sections__panels">
          {sections.map((section) => (
            <div
              aria-labelledby={tabId(idBase, section.id)}
              className="product-sections__panel"
              hidden={section.id !== activeSection}
              id={tabPanelId(idBase, section.id)}
              key={section.id}
              role="tabpanel"
              tabIndex={0}
            >
              {panel(section.id)}
            </div>
          ))}
        </div>

        <aside aria-labelledby={`${idBase}-key-specs`} className="product-key-specs">
          <h2 className="product-key-specs__title" id={`${idBase}-key-specs`}>
            Ключевые характеристики
          </h2>
          <ProductSpecificationList rows={keySpecifications} />
          <Button className="product-key-specs__more" onClick={showSpecifications} variant="text">
            Все характеристики
          </Button>
        </aside>
      </div>
    </section>
  );
}
