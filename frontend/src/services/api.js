const API_BASE = "";

export async function uploadVideo(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/video/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Failed to upload video");
  }
  return await response.json();
}

export async function importVideoUrl(url) {
  const response = await fetch(`${API_BASE}/api/video/import-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Extraction failed" }));
    throw new Error(err.detail || "Failed to import video from URL");
  }
  return await response.json();
}

export async function startStreamRecord(streamUrl, durationSeconds = 30) {
  const response = await fetch(`${API_BASE}/api/video/record-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stream_url: streamUrl, duration_seconds: durationSeconds }),
  });
  if (!response.ok) throw new Error("Failed to start stream recording");
  return await response.json();
}

export async function getStreamStatus(recordId) {
  const response = await fetch(`${API_BASE}/api/video/stream-status/${recordId}`);
  if (!response.ok) throw new Error("Failed to get recording status");
  return await response.json();
}

export async function stopStreamRecord(recordId) {
  const response = await fetch(`${API_BASE}/api/video/stop-stream/${recordId}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to stop recording");
  return await response.json();
}

export async function generateViralClips(options) {
  const response = await fetch(`${API_BASE}/api/clips/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Clipping failed" }));
    throw new Error(err.detail || "Failed to generate viral clips");
  }
  return await response.json();
}

export async function regenerateTitles(category, transcriptText = "") {
  const response = await fetch(`${API_BASE}/api/clips/regenerate-titles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, transcript_text: transcriptText }),
  });
  return await response.json();
}

export async function regenerateHooks(category, transcriptText = "") {
  const response = await fetch(`${API_BASE}/api/clips/regenerate-hooks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, transcript_text: transcriptText }),
  });
  return await response.json();
}

export async function renderClip(renderConfig) {
  const response = await fetch(`${API_BASE}/api/export/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(renderConfig),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Rendering failed" }));
    throw new Error(err.detail || "Failed to render clip video");
  }
  return await response.json();
}

export async function getTemplates() {
  const response = await fetch(`${API_BASE}/api/templates`);
  return await response.json();
}

export async function getCaptionStyles() {
  const response = await fetch(`${API_BASE}/api/templates/styles`);
  return await response.json();
}
