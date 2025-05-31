const animationStates = new WeakMap();

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
  
  // Insert wrapper and move element into it
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
  
  return wrapper;
}

export function slideOpen(element, displayType = 'block') {
  if (!element) return;
  
  const wrapper = getSlideWrapper(element);
  if (!wrapper) return;
  
  // Prevent animation conflicts
  if (animationStates.get(wrapper)) return;
  animationStates.set(wrapper, 'opening');
  
  // Save original display type of inner element
  const originalElementDisplay = element.style.display;
  
  // Set initial wrapper state
  wrapper.style.display = 'block'; // Always use block for wrapper
  wrapper.style.height = '0';
  wrapper.style.opacity = '0';
  wrapper.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
  
  // Set inner element to display: block temporarily for measurement
  element.style.display = 'block';
  
  // Wait for next frame to ensure layout calculation
  requestAnimationFrame(() => {
    // Get target height
    const targetHeight = element.scrollHeight;
    
    // Restore original display type of inner element
    element.style.display = originalElementDisplay || '';
    
    // If height is 0, skip animation
    if (targetHeight <= 0) {
      wrapper.style.display = displayType === 'flex' ? 'flex' : 'block';
      wrapper.style.height = 'auto';
      wrapper.style.opacity = '1';
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
      wrapper.style.display = displayType === 'flex' ? 'flex' : 'block';
      animationStates.delete(wrapper);
      
      wrapper.removeEventListener('transitionend', finish);
    };
    
    wrapper.addEventListener('transitionend', finish);
    setTimeout(finish, 500);
  });
}

export function slideClose(element) {
  if (!element) return;
  
  const wrapper = getSlideWrapper(element);
  if (!wrapper) return;
  
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
    animationStates.delete(wrapper);
    
    wrapper.removeEventListener('transitionend', finish);
  };
  
  wrapper.addEventListener('transitionend', finish);
  setTimeout(finish, 500);
}