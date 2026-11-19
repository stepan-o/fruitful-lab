/* The owner starts chats manually; this only copies a reusable brief introduction. */
document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-copy-prompt]');
  if (!button) return;
  const box = button.closest('.studio-kickoff');
  const text = box.querySelector('textarea');
  const status = box.querySelector('[role="status"]');
  try {
    await navigator.clipboard.writeText(text.value);
    status.textContent = 'Copied. Add your specific task before sending it.';
  } catch {
    text.focus();
    text.select();
    status.textContent = 'Select and copy the prompt above, or download the text file.';
  }
});
