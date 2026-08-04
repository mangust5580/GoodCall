import React from 'react';
import styles from './HomePage.module.scss';
import {
  Badge,
  Button,
  Checkbox,
  Counter,
  ErrorSummary,
  Grid,
  IconButton,
  InlineStatus,
  Link,
  PageContainer,
  Radio,
  Select,
  Stack,
  Status,
  Switch,
  Textarea,
  TextField,
  VisuallyHidden,
} from '@/shared/ui';
import type { ErrorSummaryItem } from '@/shared/ui';

const TECHNICAL_NOTICE =
  'Technical Shared UI verification surface — not the canonical storefront Home page.';

const SUCCESS_RESULT = 'Demonstration form validated. No data was sent.';

const NAME_FIELD_ID = 'm3-demo-name';
const NOTES_FIELD_ID = 'm3-demo-notes';
const CATEGORY_FIELD_ID = 'm3-demo-category';

type DemonstrationErrors = {
  name?: string;
  category?: string;
};

export function HomePage(): React.ReactElement {
  const navigationHeadingId = React.useId();
  const feedbackHeadingId = React.useId();
  const layoutHeadingId = React.useId();
  const formHeadingId = React.useId();
  const summaryRef = React.useRef<HTMLElement>(null);

  const [counter, setCounter] = React.useState(0);
  const [errors, setErrors] = React.useState<DemonstrationErrors>({});
  const [result, setResult] = React.useState<string | null>(null);

  const summaryItems: ErrorSummaryItem[] = [];

  if (errors.name !== undefined) {
    summaryItems.push({ message: errors.name, targetId: NAME_FIELD_ID });
  }

  if (errors.category !== undefined) {
    summaryItems.push({ message: errors.category, targetId: CATEGORY_FIELD_ID });
  }

  const hasSummary = summaryItems.length > 0;

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      summaryRef.current?.focus();
    }
  }, [errors]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '');
    const category = String(data.get('category') ?? '');
    const nextErrors: DemonstrationErrors = {};

    if (name.trim().length === 0) {
      nextErrors.name = 'Enter a demonstration name';
    }

    if (category.length === 0) {
      nextErrors.category = 'Choose a demonstration category';
    }

    setErrors(nextErrors);
    setResult(Object.keys(nextErrors).length === 0 ? SUCCESS_RESULT : null);
  }

  function handleReset(): void {
    setErrors({});
    setResult(null);
  }

  return (
    <PageContainer as="main" id="main-content" tabIndex={-1} className={styles['page']}>
      <Stack gap="xl">
        <Stack gap="sm">
          <h1 className={styles['page-title']} tabIndex={-1} data-route-focus>
            GoodCall Shared UI verification
          </h1>
          <p className={styles['notice']}>{TECHNICAL_NOTICE}</p>
          <InlineStatus tone="info">
            Every control below is a technical demonstration. Nothing is submitted and no data
            leaves the browser.
          </InlineStatus>
        </Stack>

        <Stack as="nav" gap="sm" aria-labelledby={navigationHeadingId}>
          <h2 id={navigationHeadingId} className={styles['section-title']}>
            Route navigation
          </h2>
          <Stack direction="inline" gap="sm" align="center">
            <Link to="/catalog/laptops">Catalog Category</Link>
            <Link to="/products/demo-product">Product Details</Link>
            <Link to="/cart">Shopping Cart</Link>
          </Stack>
        </Stack>

        <Stack as="section" gap="sm" aria-labelledby={feedbackHeadingId}>
          <h2 id={feedbackHeadingId} className={styles['section-title']}>
            Compact feedback and actions
          </h2>
          <Stack direction="inline" gap="sm" align="center">
            <Badge tone="info">Technical</Badge>
            <Status tone="current">Verification surface</Status>
            <Counter
              value={counter}
              tone={counter > 0 ? 'success' : 'neutral'}
              data-testid="demo-counter"
              aria-hidden="true"
            />
            <VisuallyHidden>{`Demonstration counter value: ${String(counter)}`}</VisuallyHidden>
          </Stack>
          <Stack direction="inline" gap="sm" align="center">
            <Button
              onClick={() => {
                setCounter((value) => value + 1);
              }}
            >
              Increment demonstration counter
            </Button>
            <IconButton
              label="Reset demonstration counter"
              onClick={() => {
                setCounter(0);
              }}
            >
              ↺
            </IconButton>
          </Stack>
        </Stack>

        <Stack as="section" gap="sm" aria-labelledby={layoutHeadingId}>
          <h2 id={layoutHeadingId} className={styles['section-title']}>
            Layout primitives
          </h2>
          <Grid gap="md" minItemWidth="md">
            <div className={styles['panel']}>
              <h3 className={styles['panel-title']}>Intrinsic grid</h3>
              <p>
                Grid tracks resolve from the available inline size, so panels wrap without a
                page-specific breakpoint.
              </p>
            </div>
            <div className={styles['panel']}>
              <h3 className={styles['panel-title']}>Stack flow</h3>
              <p>
                Stack owns the vertical rhythm and the wrapping inline rows used throughout this
                verification surface.
              </p>
            </div>
          </Grid>
        </Stack>

        <Stack as="section" gap="md" aria-labelledby={formHeadingId}>
          <h2 id={formHeadingId} className={styles['section-title']}>
            Form controls
          </h2>

          {hasSummary ? (
            <ErrorSummary
              ref={summaryRef}
              title="Fix these demonstration fields"
              items={summaryItems}
              headingLevel={3}
            />
          ) : null}

          {result === null ? null : (
            <InlineStatus tone="success" role="status">
              {result}
            </InlineStatus>
          )}

          <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
            <Stack gap="md">
              <TextField
                id={NAME_FIELD_ID}
                name="name"
                label="Name"
                required
                {...(errors.name === undefined ? {} : { error: errors.name })}
              />
              <Textarea
                id={NOTES_FIELD_ID}
                name="notes"
                label="Notes"
                description="Optional technical notes"
                rows={3}
              />
              <Select
                id={CATEGORY_FIELD_ID}
                name="category"
                label="Category"
                required
                defaultValue=""
                {...(errors.category === undefined ? {} : { error: errors.category })}
              >
                <option value="">Choose a category</option>
                <option value="laptops">Laptops</option>
                <option value="phones">Phones</option>
              </Select>
              <Checkbox name="updates" label="Receive demonstration updates" />
              <fieldset className={styles['fieldset']}>
                <legend>Delivery preference</legend>
                <Stack gap="xs">
                  <Radio name="delivery" value="courier" label="Courier" />
                  <Radio name="delivery" value="pickup" label="Pickup" />
                </Stack>
              </fieldset>
              <Switch name="compact" label="Enable compact notifications" />
              <Stack direction="inline" gap="sm" align="center">
                <Button type="submit">Validate demonstration form</Button>
                <Button type="reset" variant="secondary">
                  Reset demonstration form
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
