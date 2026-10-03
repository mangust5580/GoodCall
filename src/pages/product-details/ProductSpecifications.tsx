import type {
  ProductDetailsSpecification,
  ProductDetailsSpecificationGroup,
} from './productDetailsView';

interface ProductSpecificationListProps {
  readonly rows: readonly ProductDetailsSpecification[];
}

export function ProductSpecificationList({ rows }: ProductSpecificationListProps) {
  return (
    <dl className="product-specs">
      {rows.map((row) => (
        <div className="product-specs__row" key={row.label}>
          <dt className="product-specs__label">{row.label}</dt>
          <dd className="product-specs__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

interface ProductSpecificationsProps {
  readonly groups: readonly ProductDetailsSpecificationGroup[];
}

export function ProductSpecifications({ groups }: ProductSpecificationsProps) {
  return (
    <div className="product-panel">
      <h2 className="product-panel__title">Характеристики</h2>
      <div className="product-spec-groups">
        {groups.map((group) => (
          <section className="product-spec-groups__group" key={group.title}>
            <h3 className="product-spec-groups__title">{group.title}</h3>
            <ProductSpecificationList rows={group.rows} />
          </section>
        ))}
      </div>
    </div>
  );
}
