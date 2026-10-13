import { useRef, useState } from 'react';
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
        {/* Phase 21: aria-label names the profile so SR users hear
           "Play as <name>" instead of "플레이" in isolation. */}
        <button
          className="btn-primary"
          onClick={onSelect}
          aria-label={`Play as ${profile.name}`}
        >
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

  const handleCreate = () => {
    if (newName.trim().length === 0) {
      alert('이름을 입력해주세요');
      return;
    }
    onCreate(newName.trim(), selectedAvatar);
    setNewName('');
    setShowCreate(false);
  };

  const avatarRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const handleAvatarKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const last = AVATAR_OPTIONS.length - 1;
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = index === last ? 0 : index + 1;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = index === 0 ? last : index - 1;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = last;
    } else {
      return;
    }
    e.preventDefault();
    const next = AVATAR_OPTIONS[nextIndex];
    setSelectedAvatar(next);
    avatarRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="profile-selector">
      <header className="profile-header">
        <h1>Typing Language</h1>
        <p>프로필을 선택하거나 새로 만드세요</p>
      </header>

      <div className="profile-grid">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onSelect={() => onSelect(profile)}
            onDelete={() => onDelete(profile.id)}
          />
        ))}

        {/* Phase 21/36: add-profile card is a real <button> with an
           aria-label (was a <div> with no keyboard access). Space/Enter
           activation comes for free because native <button> handles it. */}
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
        <div className="profile-create-modal">
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="Create new profile"
          >
            <h2>새 프로필 만들기</h2>

            <div className="form-group">
              {/* Phase 21: id/htmlFor binding so SR tools that walk the
                 accessibility tree (rather than rely on DOM nesting) still
                 hear "Name" on focus. */}
              <label htmlFor="profile-name-input">이름</label>
              <input
                id="profile-name-input"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="닉네임 입력"
                maxLength={20}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Avatar</label>
              {/* Phase 21/36: avatar grid is role="radiogroup" with each
                 option a role="radio" + aria-checked so SR users hear
                 selection semantics. */}
              <div
                className="avatar-grid"
                role="radiogroup"
                aria-label="Choose an avatar"
              >
                {AVATAR_OPTIONS.map((avatar, idx) => (
                  <button
                    key={avatar}
                    ref={(el) => { avatarRefs.current[idx] = el; }}
                    type="button"
                    className={`avatar-option ${avatar === selectedAvatar ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar(avatar)}
                    onKeyDown={(e) => handleAvatarKeyDown(e, idx)}
                    role="radio"
                    aria-checked={avatar === selectedAvatar}
                    aria-label={`Avatar ${avatar}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCreate(false)}>
                취소
              </button>
              <button className="btn-primary" onClick={handleCreate}>
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
