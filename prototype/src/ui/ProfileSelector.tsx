import { useState, useEffect, useRef } from 'react';
import type { UserProfile } from '../types.js';

interface ProfileSelectorProps {
  profiles: UserProfile[];
  onSelect: (profile: UserProfile) => void;
  onCreate: (name: string, avatar: string) => void;
  onDelete: (profileId: string) => void;
}

const AVATAR_OPTIONS = ['👤', '👨', '👩', '🧑', '👦', '👧', '🧒', '👶', '🐱', '🐶', '🦊', '🐼'];

function ProfileCard({
  profile,
  onSelect,
  onDelete,
}: {
  profile: UserProfile;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const totalStars = Object.values(profile.progress.stageRecords).reduce(
    (sum, record) => sum + record.stars,
    0
  );
  const clearedCount = Object.values(profile.progress.stageRecords).filter((r) => r.cleared).length;

  return (
    <div className="profile-card">
      <div className="profile-avatar" aria-hidden="true">{profile.avatar || '👤'}</div>
      <h3>{profile.name}</h3>
      <div className="profile-stats">
        <p>레벨 {profile.progress.level}</p>
        <p>⭐ {totalStars} 별</p>
        <p>✅ {clearedCount} 스테이지</p>
      </div>
      <div className="profile-actions">
        <button className="btn-primary" onClick={onSelect} aria-label={`Play as ${profile.name}`}>
          플레이
        </button>
        <button
          className="btn-danger"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`${profile.name} 프로필을 삭제하시겠습니까?`)) {
              onDelete();
            }
          }}
          aria-label={`Delete profile ${profile.name}`}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export function ProfileSelector({ profiles, onSelect, onCreate, onDelete }: ProfileSelectorProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  // Phase 21: focus management for the create modal — focus cancel on open,
  // restore previous focus on close, Escape dismisses.
  useEffect(() => {
    if (!showCreate) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowCreate(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [showCreate]);

  const handleCreate = () => {
    if (newName.trim().length === 0) {
      alert('이름을 입력해주세요');
      return;
    }
    onCreate(newName.trim(), selectedAvatar);
    setNewName('');
    setShowCreate(false);
  };

  return (
    <div className="profile-selector">
      <header className="profile-header">
        <h1>Typing Language</h1>
        <p>프로필을 선택하거나 새로 만드세요</p>
      </header>

      <div className="profile-grid" role="list" aria-label="Existing profiles">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onSelect={() => onSelect(profile)}
            onDelete={() => onDelete(profile.id)}
          />
        ))}

        {!showCreate && (
          <button
            type="button"
            className="profile-card profile-card-add"
            onClick={() => setShowCreate(true)}
            aria-label="Create new profile"
          >
            <div className="profile-avatar" aria-hidden="true">➕</div>
            <h3>새 프로필</h3>
            <p>클릭하여 생성</p>
          </button>
        )}
      </div>

      {showCreate && (
        <div className="profile-create-modal" onClick={() => setShowCreate(false)}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="Create new profile"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>새 프로필 만들기</h2>

            <div className="form-group">
              <label htmlFor="profile-name-input">이름</label>
              <input
                id="profile-name-input"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="닉네임 입력"
                maxLength={20}
              />
            </div>

            <div className="form-group">
              <label id="avatar-group-label">아바타</label>
              <div
                className="avatar-grid"
                role="radiogroup"
                aria-labelledby="avatar-group-label"
              >
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    className={`avatar-option ${avatar === selectedAvatar ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar(avatar)}
                    role="radio"
                    aria-checked={avatar === selectedAvatar}
                    aria-label={`Avatar ${avatar}`}
                  >
                    <span aria-hidden="true">{avatar}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button
                ref={cancelButtonRef}
                type="button"
                className="btn-secondary"
                onClick={() => setShowCreate(false)}
                aria-label="Cancel and close dialog (Escape)"
              >
                취소
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleCreate}
                aria-label="Create profile"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
