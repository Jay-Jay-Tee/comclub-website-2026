# idea: back to top button

> 👋 **this is an example** of an idea submitted as a pr with **no code**. if u're not coding, this is exactly what ur pr can look like: a readme explaining the idea and how u'd build it. this idea is taken, so pick ur own!

goes with issue #3.

## the problem

on a phone, pages like **events**, **resources** and the **elections** pages get long. once u're near the bottom, getting back to the menu means a lot of thumb scrolling.

## what i want to add

a small round button in the bottom right corner. it shows up once u've scrolled down a bit, and tapping it takes u smoothly back to the top.

```
 ┌──────────────────────┐
 │  nav bar             │
 │                      │
 │  ...long page...     │
 │                      │
 │                 (↑)  │  <- only appears after scrolling
 └──────────────────────┘
```

## how i'd build it

**1. where it lives**

a new component, `src/components/BackToTop.tsx`, next to the existing `Card.tsx` and `Table.tsx`.

i'd render it once in `src/App.jsx`, right next to the existing `<ScrollToTop />`, so it shows up on every page without touching any of the pages themselves.

(fun fact: `App.jsx` already has a `ScrollToTop` helper, but that one only jumps to the top when u change pages. this button is for scrolling back up on the same page.)

**2. when it shows up**

only after u've scrolled past one screen's worth. so on short pages like privacy, it never appears at all.

roughly: "if how far i've scrolled is more than the height of the screen, show the button".

**3. what happens when u tap it**

it scrolls smoothly to the top. if someone has "reduce motion" turned on in their phone settings, it jumps instead of sliding. the site already respects that setting in `App.css`, so this keeps it consistent.

**4. how it looks**

it uses the site's own colours from `tailwind.config.js`:
- background: `primary` (#365486)
- on hover: `highlight` (#61afef)
- a white arrow icon. the site already uses `react-icons`, so no new library is needed

it sits in the bottom right, small enough that it doesn't cover the footer icons.

**5. making sure everyone can use it**

- it's a real `<button>`, so u can reach it by pressing Tab and use it with Enter
- it has `aria-label="back to top"`, so screen readers say what it does
- it gets a visible outline when it's focused with the keyboard

## a rough example of what the code might look like

this is a sketch to show the idea. i haven't run it.

```tsx
// src/components/BackToTop.tsx (sketch)
function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button aria-label="back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-4 right-4 rounded-full bg-primary hover:bg-highlight p-3 text-white">
      ↑
    </button>
  );
}
```

## how i'd test it

- events, resources and an elections page on a phone-sized screen (devtools, toggle device toolbar)
- the privacy page, to check the button doesn't show up on a short page
- only the keyboard: Tab to the button, then Enter
- with "reduce motion" turned on
- check it never covers the footer icons

## what i'm not touching

the nav bar, the footer and every page layout stay exactly the same. it's one new file plus one line in `App.jsx`.

## questions for u

- is the bottom right ok, or does it clash with anything on some pages?
- should it show on every page, or only the long ones?
