import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/")
    assert res.status_code == 200
    assert "chismOSOS" in res.json()["message"]
    print("[OK] Health check OK")

import uuid

def test_auth_and_experience_flow():
    # 1. Register with unique test username
    unique_user = f"cupido_{uuid.uuid4().hex[:6]}"
    reg_data = {"username": unique_user, "password": "password123"}
    res = client.post("/api/auth/register", json=reg_data)
    assert res.status_code == 201
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Registro y JWT OK")

    # 2. Login
    res = client.post("/api/auth/login", json=reg_data)
    assert res.status_code == 200
    print("[OK] Login OK")

    # 3. Create Experience
    exp_data = {
        "title": "Nuestra Gran Amistad",
        "recipient_name": "Valentina",
        "sender_name": "Fabian",
        "envelope_note": "Para ti en este 14 de Septiembre"
    }
    res = client.post("/api/experiences", json=exp_data, headers=headers)
    assert res.status_code == 201
    exp = res.json()
    exp_id = exp["id"]
    slug = exp["slug"]
    assert exp["recipient_name"] == "Valentina"
    assert len(exp["selection_steps"]) == 1
    assert len(exp["cards"]) == 1
    print(f"[OK] Experiencia creada con slug '{slug}' OK")

    # 4. Add Card with valid word count (<= 250 words)
    valid_text = "Esta es una carta hermosa con pocas palabras para celebrar nuestro dia."
    card_data = {
        "title": "Recuerdo 1",
        "image_url": "https://example.com/photo.jpg",
        "text_content": valid_text,
        "order_index": 1
    }
    res = client.post(f"/api/experiences/{exp_id}/cards", json=card_data, headers=headers)
    assert res.status_code == 201
    assert res.json()["word_count"] == len(valid_text.split())
    print("[OK] Creacion de tarjeta valida OK")

    # 5. Try to add card exceeding 250 words (should fail with 422 Unprocessable Entity)
    long_text = " ".join(["palabra"] * 251)
    bad_card = {
        "title": "Tarjeta muy larga",
        "text_content": long_text
    }
    res = client.post(f"/api/experiences/{exp_id}/cards", json=bad_card, headers=headers)
    assert res.status_code == 422
    print("[OK] Validacion estricta de 250 palabras OK (rechaza mas de 250)")

    # 6. Test Public Recipient Endpoint (no auth needed)
    res = client.get(f"/api/public/experience/{slug}")
    assert res.status_code == 200
    pub_data = res.json()
    assert pub_data["recipient_name"] == "Valentina"
    assert len(pub_data["cards"]) == 2
    print("[OK] Endpoint publico para el destinatario OK")

if __name__ == "__main__":
    test_health()
    test_auth_and_experience_flow()
    print("\nTODOS LOS TESTS DEL BACKEND PASARON EXITOSAMENTE!")
