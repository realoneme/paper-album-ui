import '@/styles/extra/carousel.css';
import * as React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button, type ButtonProps } from '@/components/ui/button';

export type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];

interface CarouselContextValue {
  carouselRef: UseEmblaCarouselType[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  /** Index of the selected scroll snap. */
  selectedIndex: number;
  /** Slide indexes belonging to the selected snap (these get aria-current). */
  currentSlides: number[];
  /** Slide elements belonging to the selected snap. */
  currentNodes: HTMLElement[];
  snapCount: number;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error('useCarousel must be used within a <Carousel />');
  return context;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  setApi?: (api: CarouselApi) => void;
  /** Accessible name of the carousel region, for example "Featured prints". */
  'aria-label'?: string;
}

/** A strip of prints that pages left and right (Embla). Neighbours peek at reduced opacity. */
export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ opts, plugins, setApi, className, children, onKeyDownCapture, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel({ align: 'start', ...opts }, plugins);
    const [state, setState] = React.useState({ canScrollPrev: false, canScrollNext: false, selectedIndex: 0, currentSlides: [0], currentNodes: [] as HTMLElement[], snapCount: 0 });

    const onSelect = React.useCallback((embla: NonNullable<CarouselApi>) => {
      const selectedIndex = embla.selectedScrollSnap();
      const registry = embla.internalEngine().slideRegistry;
      const currentSlides = registry[selectedIndex] ?? [selectedIndex];
      const nodes = embla.slideNodes();
      setState({
        canScrollPrev: embla.canScrollPrev(),
        canScrollNext: embla.canScrollNext(),
        selectedIndex,
        currentSlides,
        currentNodes: currentSlides.map((i) => nodes[i]).filter((node): node is HTMLElement => Boolean(node)),
        snapCount: embla.scrollSnapList().length,
      });
    }, []);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);
    const scrollTo = React.useCallback((index: number) => api?.scrollTo(index), [api]);

    React.useEffect(() => {
      if (api && setApi) setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on('reInit', onSelect).on('select', onSelect);
      return () => {
        api.off('reInit', onSelect).off('select', onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider value={{ carouselRef, api, scrollPrev, scrollNext, scrollTo, ...state }}>
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          className={cn('pa-carousel-root', className)}
          onKeyDownCapture={(event) => {
            onKeyDownCapture?.(event);
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              scrollPrev();
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              scrollNext();
            }
          }}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = 'Carousel';

export type CarouselContentProps = React.HTMLAttributes<HTMLDivElement>;
/** The clipped viewport and the moving track. */
export const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className="pa-carousel">
      <div ref={ref} className={cn('pa-carousel-track track', className)} {...props} />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional 0-based position; by default the slide finds itself among Embla's slide nodes. */
  index?: number;
}
/** One slide. Put a print (photo + handwritten caption) inside. The current slide gets aria-current="true". */
export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(({ className, index, ...props }, ref) => {
  const { currentSlides, currentNodes } = useCarousel();
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const setRefs = React.useCallback(
    (element: HTMLDivElement | null) => {
      setNode(element);
      if (typeof ref === 'function') ref(element);
      else if (ref) ref.current = element;
    },
    [ref],
  );
  const current = index !== undefined ? currentSlides.includes(index) : node !== null && currentNodes.includes(node);
  return (
    <div
      ref={setRefs}
      role="group"
      aria-roledescription="slide"
      aria-current={current ? 'true' : undefined}
      className={cn('slide', className)}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

export interface CarouselFlipCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 0-based position of the slide this card sits in. */
  index: number;
  /** The print. */
  front: React.ReactNode;
  /** Its details, shown when the print is turned over (use `pa-flip-title`, `pa-flip-meta`, `pa-flip-text`). */
  back: React.ReactNode;
  /** Accessible name of the card while it shows the front. */
  label?: string;
}
/**
 * A print that turns over for its details. Clicking (or Enter/Space on) the current slide flips it; clicking another
 * slide brings that slide to the centre. A drag never flips (Embla swallows the click after a drag), and moving to
 * another slide turns the card back over.
 */
export const CarouselFlipCard = React.forwardRef<HTMLDivElement, CarouselFlipCardProps>(
  ({ index, front, back, label = 'Show details', className, onClick, onKeyDown, ...props }, ref) => {
    const { currentSlides, scrollTo } = useCarousel();
    const current = currentSlides.includes(index);
    const [flipped, setFlipped] = React.useState(false);
    React.useEffect(() => {
      if (!current) setFlipped(false);
    }, [current]);
    const activate = () => (current ? setFlipped((f) => !f) : scrollTo(index));
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={current ? 0 : -1}
        aria-pressed={flipped}
        aria-label={label}
        data-state={flipped ? 'back' : 'front'}
        className={cn('pa-flip', className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) activate();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || (event.key !== 'Enter' && event.key !== ' ')) return;
          event.preventDefault();
          activate();
        }}
        {...props}
      >
        <div className="pa-flip-inner">
          <div className="pa-flip-face pa-flip-front" aria-hidden={flipped || undefined}>
            {front}
          </div>
          <div className="pa-flip-face pa-flip-back" aria-hidden={!flipped || undefined}>
            {back}
          </div>
        </div>
      </div>
    );
  },
);
CarouselFlipCard.displayName = 'CarouselFlipCard';

export type CarouselButtonProps = ButtonProps;

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
  ({ variant = 'secondary', size = 'icon', className, onClick, children, ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel();
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label="Previous slide"
        className={cn('pa-carousel-prev', className)}
        disabled={!canScrollPrev}
        onClick={(event) => {
          onClick?.(event);
          scrollPrev();
        }}
        {...props}
      >
        {children ?? <ChevronLeft className="pa-i" aria-hidden />}
      </Button>
    );
  },
);
CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
  ({ variant = 'secondary', size = 'icon', className, onClick, children, ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label="Next slide"
        className={cn('pa-carousel-next', className)}
        disabled={!canScrollNext}
        onClick={(event) => {
          onClick?.(event);
          scrollNext();
        }}
        {...props}
      >
        {children ?? <ChevronRight className="pa-i" aria-hidden />}
      </Button>
    );
  },
);
CarouselNext.displayName = 'CarouselNext';

export interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of dots when the carousel has not measured yet (defaults to the measured snap count). */
  count?: number;
}
/** One dot per page; the current one stretches into a bar. */
export const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(({ className, count, ...props }, ref) => {
  const { snapCount, selectedIndex, scrollTo } = useCarousel();
  const total = snapCount || count || 0;
  return (
    <div ref={ref} className={cn('pa-dots', className)} {...props}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === selectedIndex ? 'true' : undefined}
          onClick={() => scrollTo(i)}
        />
      ))}
    </div>
  );
});
CarouselDots.displayName = 'CarouselDots';

export interface CarouselCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Total when the carousel has not measured yet (defaults to the measured snap count). */
  count?: number;
}
/** "3 / 12": the current page and the total, announced politely as "Slide 3 of 12". */
export const CarouselCounter = React.forwardRef<HTMLDivElement, CarouselCounterProps>(({ className, count, ...props }, ref) => {
  const { snapCount, selectedIndex } = useCarousel();
  const total = snapCount || count || 0;
  const current = total ? Math.min(selectedIndex + 1, total) : 0;
  return (
    <div ref={ref} className={cn('pa-carousel-counter', className)} aria-live="polite" aria-atomic="true" {...props}>
      <span className="pa-carousel-counter-value" aria-hidden="true">
        <b>{current}</b>
        <span className="sep"> / </span>
        {total}
      </span>
      <span className="pa-sr">{`Slide ${current} of ${total}`}</span>
    </div>
  );
});
CarouselCounter.displayName = 'CarouselCounter';

export interface CarouselIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `dots` always, `counter` always, or `auto`: dots up to `maxDots` pages, the counter beyond. */
  variant?: 'auto' | 'dots' | 'counter';
  /** Most dots `auto` will show before switching to the counter. Default 7. */
  maxDots?: number;
  /** Total before the carousel has measured. */
  count?: number;
}
/** Shows where you are and how many there are: dots for short strips, "3 / 12" for long ones. */
export const CarouselIndicator = React.forwardRef<HTMLDivElement, CarouselIndicatorProps>(
  ({ variant = 'auto', maxDots = 7, count, ...props }, ref) => {
    const { snapCount } = useCarousel();
    const total = snapCount || count || 0;
    const mode = variant === 'auto' ? (total > maxDots ? 'counter' : 'dots') : variant;
    return mode === 'counter' ? (
      <CarouselCounter ref={ref} count={count} data-indicator="counter" {...props} />
    ) : (
      <CarouselDots ref={ref} count={count} data-indicator="dots" {...props} />
    );
  },
);
CarouselIndicator.displayName = 'CarouselIndicator';

export type CarouselControlsProps = React.HTMLAttributes<HTMLDivElement>;
/** Lays out Previous, dots (or an indicator / counter) and Next in one centred row. */
export const CarouselControls = React.forwardRef<HTMLDivElement, CarouselControlsProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-carousel-controls', className)} {...props} />
));
CarouselControls.displayName = 'CarouselControls';
