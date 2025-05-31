// utils/ui/slide.js
const animationStates = new WeakMap();
const resizeObservers = new WeakMap();

function getSlideWrapper(element) {
  if (!element) return null;
  
  // Return existing wrapper if present
  if (element.parentElement?.hasAttribute('data-slide-wrapper')) {
    return element.parentElement;
  }
  
  // Create new wrapper
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-slide-wrapper', 'true');
  wrapper.style.overflow = 'hidden';
  wrapper.style.willChange = 'height'; // For performance
  
  // Insert wrapper and move element into it
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
  
  return wrapper;
}

function setupResizeObserver(element, wrapper) {
  // Clean up any existing observer
  if (resizeObservers.has(wrapper)) {
    resizeObservers.get(wrapper).disconnect();
  }
  
  // Create new observer
  const observer = new ResizeObserver(entries => {
    if (animationStates.get(wrapper) === 'opening') {
      // Adjust height during opening animation
      const height = element.scrollHeight;
      if (height > 0) {
        wrapper.style.height = `${height}px`;
      }
    }
  });
  
  observer.observe(element);
  resizeObservers.set(wrapper, observer);
}

export function slideOpen(element, displayType = 'block') {
  if (!element) return;
  
  const wrapper = getSlideWrapper(element);
  if (!wrapper) return;
  
  // Prevent animation conflicts
  if (animationStates.get(wrapper)) return;
  
  // Set up resize observer
  setupResizeObserver(element, wrapper);
  
  animationStates.set(wrapper, 'opening');
  
  // Save original display type of inner element
  const originalElementDisplay = element.style.display;
  
  // Set initial wrapper state
  wrapper.style.display = displayType;
  wrapper.style.height = '0';
  wrapper.style.opacity = '0';
  wrapper.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
  
  // Set inner element to correct display for measurement
  element.style.display = displayType;
  
  // Double RAF to ensure layout
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Get target height
      const targetHeight = element.scrollHeight;
      
      // If height is 0, skip animation
      if (targetHeight <= 0) {
        wrapper.style.height = 'auto';
        wrapper.style.opacity = '1';
        element.style.display = originalElementDisplay || '';
        animationStates.delete(wrapper);
        return;
      }
      
      // Force reflow
      wrapper.offsetHeight;
      
      // Animate to target height
      wrapper.style.height = `${targetHeight}px`;
      wrapper.style.opacity = '1';
      
      // Cleanup after animation
      const finish = () => {
        if (animationStates.get(wrapper) !== 'opening') return;
        
        wrapper.style.height = 'auto';
        element.style.display = originalElementDisplay || '';
        animationStates.delete(wrapper);
        
        // Re-enable transitions after animation
        wrapper.style.transition = '';
        
        wrapper.removeEventListener('transitionend', finish);
      };
      
      wrapper.addEventListener('transitionend', finish);
      setTimeout(finish, 500);
    });
  });
}

export function slideClose(element) {
  if (!element) return;
  
  const wrapper = getSlideWrapper(element);
  if (!wrapper) return;
  
  // Clean up resize observer
  if (resizeObservers.has(wrapper)) {
    resizeObservers.get(wrapper).disconnect();
    resizeObservers.delete(wrapper);
  }
  
  // Prevent conflicts
  if (animationStates.get(wrapper)) return;
  animationStates.set(wrapper, 'closing');
  
  // Capture current height
  const startHeight = element.scrollHeight;
  
  // Skip animation if height is already 0
  if (startHeight <= 0) {
    wrapper.style.display = 'none';
    animationStates.delete(wrapper);
    return;
  }
  
  // Set starting point
  wrapper.style.display = window.getComputedStyle(wrapper).display;
  wrapper.style.height = `${startHeight}px`;
  wrapper.style.opacity = '1';
  wrapper.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
  
  // Force reflow
  wrapper.offsetHeight;
  
  // Animate collapse
  wrapper.style.height = '0';
  wrapper.style.opacity = '0';
  
  // Final cleanup
  const finish = () => {
    if (animationStates.get(wrapper) !== 'closing') return;
    
    wrapper.style.display = 'none';
    wrapper.style.height = 'auto';
    wrapper.style.transition = '';
    animationStates.delete(wrapper);
    
    wrapper.removeEventListener('transitionend', finish);
  };
  
  wrapper.addEventListener('transitionend', finish);
  setTimeout(finish, 500);
}