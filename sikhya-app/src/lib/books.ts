export interface PsebBook {
  id: string;
  classNum: number;
  subject: string;
  title: string;
  language: 'English' | 'Punjabi' | 'Hindi' | 'Sanskrit';
  stream?: 'Science' | 'Commerce' | 'Arts' | 'General';
  part?: number;
  downloadUrl: string;
  viewUrl: string;   // Google Drive preview iframe URL
}

/** Convert  https://drive.google.com/uc?export=download&id=X
 *  →        https://drive.google.com/file/d/X/preview          */
function gdPreview(downloadUrl: string): string {
  try {
    const id = new URL(downloadUrl).searchParams.get('id');
    if (!id) return downloadUrl;
    return `https://drive.google.com/file/d/${id}/preview`;
  } catch {
    return downloadUrl;
  }
}

function book(
  classNum: number,
  subject: string,
  title: string,
  downloadUrl: string,
  language: PsebBook['language'] = 'English',
  part?: number,
  stream?: PsebBook['stream'],
): PsebBook {
  const slug = `${title.toLowerCase().replace(/\s+/g, '-')}`;
  return {
    id: slug,
    classNum,
    subject,
    title,
    language,
    stream,
    part,
    downloadUrl,
    viewUrl: gdPreview(downloadUrl),
  };
}

// ─── Catalog ────────────────────────────────────────────────────────────────

export const BOOKS: PsebBook[] = [
  // ── Class 6 ──────────────────────────────────────────────────────────────
  book(6, 'Science',     'Class 6 Science',        'https://drive.google.com/uc?export=download&id=1iEDRH5jMLTwhKvPvOmBoW7QEqWS0b8Ml'),
  book(6, 'Physics',     'Class 6 Physics',        'https://drive.google.com/uc?export=download&id=1PemwlD4Ieyyua5NZ59zL21f7hnY3UeNW'),
  book(6, 'Mathematics', 'Class 6 Mathematics Part 1', 'https://drive.google.com/uc?export=download&id=1Olz5SgWvZBcRgyMMese7IoOoc8TIiTX_', 'English', 1),
  book(6, 'Mathematics', 'Class 6 Mathematics Part 2', 'https://drive.google.com/uc?export=download&id=1DMcxr1Pj_ApygXr8HJ1SB2QZOkZKUv59', 'English', 2),
  book(6, 'Sanskrit',    'Class 6 Sanskrit',       'https://drive.google.com/uc?export=download&id=11HR-T3kfF_4omrOk5bAHXbzNUCElRX9-', 'Sanskrit'),
  book(6, 'Hindi',       'Class 6 Hindi',          'https://drive.google.com/uc?export=download&id=1Rz71eCt5VTcs1QM1K6HviFn13WjqekrN', 'Hindi'),
  book(6, 'English',     'Class 6 English Part 1', 'https://drive.google.com/uc?export=download&id=16gBZZ2vUHjhjoKQZ8NMzcqUwJFvLFneg', 'English', 1),
  book(6, 'English',     'Class 6 English Part 2', 'https://drive.google.com/uc?export=download&id=1BNmup56dIi8IP4PmiwbbCMQQ7hF7Nmo6', 'English', 2),

  // ── Class 7 ──────────────────────────────────────────────────────────────
  book(7, 'Sanskrit',    'Class 7 Sanskrit',       'https://drive.google.com/uc?export=download&id=1ZO2w3f7xVnkLumWyPqeUed0fXUh_7r9N', 'Sanskrit'),
  book(7, 'Physics',     'Class 7 Physics',        'https://drive.google.com/uc?export=download&id=1u4QceVY65e4gUOmnLY4lOePmDDSxfigB'),
  book(7, 'Hindi',       'Class 7 Hindi',          'https://drive.google.com/uc?export=download&id=17FMuvDDbcbjQ2yosokjZKC9TGGc3u7nR', 'Hindi'),
  book(7, 'English',     'Class 7 English Part 1', 'https://drive.google.com/uc?export=download&id=1d72xKSzWnkqY0QrmUQ31mGSmgZlnM_ga', 'English', 1),
  book(7, 'English',     'Class 7 English Part 2', 'https://drive.google.com/uc?export=download&id=1bKLXvU6EJXVsJQjsmm3oZDIKlY7cccue', 'English', 2),
  book(7, 'Science',     'Class 7 Science Part 1', 'https://drive.google.com/uc?export=download&id=1DSuYCrZD1HARcgUV6Md37v90-I6Ifoby', 'English', 1),
  book(7, 'Science',     'Class 7 Science Part 2', 'https://drive.google.com/uc?export=download&id=1nJUGYcWfEPk8oUd2dTLluWpK5OFYQvm4', 'English', 2),
  book(7, 'Mathematics', 'Class 7 Mathematics Part 1', 'https://drive.google.com/uc?export=download&id=1T_WmC494zKISjonKFxMfXN1Y6mkERtJH', 'English', 1),
  book(7, 'Mathematics', 'Class 7 Mathematics Part 2', 'https://drive.google.com/uc?export=download&id=1GXHhQ1Lw13Naw9DsvJnm6PS2cmbWmwxu', 'English', 2),

  // ── Class 8 ──────────────────────────────────────────────────────────────
  book(8, 'Science',     'Class 8 Science Part 1', 'https://drive.google.com/uc?export=download&id=1LqXENbawui8u8Trw9KTiuh1SNMjlt3-e', 'English', 1),
  book(8, 'Science',     'Class 8 Science Part 2', 'https://drive.google.com/uc?export=download&id=1J0X0NU48mSwDGjRZNlRmmA3_3UDSDKFO', 'English', 2),
  book(8, 'Physics',     'Class 8 Physics',        'https://drive.google.com/uc?export=download&id=1NJ_CK-6nACICG17vc6yiWcUss1Ryq1LW'),
  book(8, 'Mathematics', 'Class 8 Mathematics Part 1', 'https://drive.google.com/uc?export=download&id=15OUk6mvs7At8MFh6OllwSxkGZkvI4UNA', 'English', 1),
  book(8, 'Mathematics', 'Class 8 Mathematics Part 2', 'https://drive.google.com/uc?export=download&id=19BkBBdE6cdVk-VWTJcX2kru_sPIcYg6H', 'English', 2),
  book(8, 'English',     'Class 8 English Part 1', 'https://drive.google.com/uc?export=download&id=1jbXm1SdHcpaWqeagQ_ATNj0SIFJ_fvu8', 'English', 1),
  book(8, 'English',     'Class 8 English Part 2', 'https://drive.google.com/uc?export=download&id=15p4O4hF5ROiTd5te2EEJhqtcH62RiTdT', 'English', 2),
  book(8, 'English',     'Class 8 English Part 3', 'https://drive.google.com/uc?export=download&id=14eQKZyhYoXgDWwOt1ByvL_DehmGxMAoL', 'English', 3),
  book(8, 'Sanskrit',    'Class 8 Sanskrit',       'https://drive.google.com/uc?export=download&id=1zTuuCjkv96KIHZsq-dQZJzQrFiPMzvc5', 'Sanskrit'),
  book(8, 'Hindi',       'Class 8 Hindi Part 1',   'https://drive.google.com/uc?export=download&id=1ztjagSPH5rcWgJBcVSf3q3Ut5cyRHsjc', 'Hindi', 1),
  book(8, 'Hindi',       'Class 8 Hindi Part 2',   'https://drive.google.com/uc?export=download&id=1ZXC48-07ZDDTP-U4RJvAe7di8QiwAWq1', 'Hindi', 2),

  // ── Class 9 ──────────────────────────────────────────────────────────────
  book(9, 'Science',     'Class 9 Science Part 1', 'https://drive.google.com/uc?export=download&id=1JLIJOmOK9uepJn0ITZ840cE7jSlsK-eF', 'English', 1),
  book(9, 'Science',     'Class 9 Science Part 2', 'https://drive.google.com/uc?export=download&id=17Ta0LQmN9ar9EqhxhKHFBLd10LZ6rPlq', 'English', 2),
  book(9, 'Mathematics', 'Class 9 Mathematics Part 1', 'https://drive.google.com/uc?export=download&id=1sKp6OwuHypDe-sUhgjHtH20si2hW05e-', 'English', 1),
  book(9, 'Mathematics', 'Class 9 Mathematics Part 2', 'https://drive.google.com/uc?export=download&id=14wWwa3-zUOJGdHZQ6nuJvO2ZRFvSR66B', 'English', 2),
  book(9, 'English',     'Class 9 English Part 1', 'https://drive.google.com/uc?export=download&id=1JGxJTLo_E_zCUzQ9SuduVoT7J515pxsO', 'English', 1),
  book(9, 'English',     'Class 9 English Part 2', 'https://drive.google.com/uc?export=download&id=1Y_KcfsEvnYPVzatfGT4xb5sZwyQUdJIg', 'English', 2),
  book(9, 'English',     'Class 9 English Part 3', 'https://drive.google.com/uc?export=download&id=1XgAPKjM6m9vy7YQhQixrjYoMJY9Qxi4X', 'English', 3),

  // ── Class 10 ─────────────────────────────────────────────────────────────
  book(10, 'Science',     'Class 10 Science Part 1', 'https://drive.google.com/uc?export=download&id=1-LYHZvpB1amHRt0ifQXOaqi999eod-Il', 'English', 1),
  book(10, 'Science',     'Class 10 Science Part 2', 'https://drive.google.com/uc?export=download&id=10ciTbXE2ee-ea5aE5LdJz-2uTjhrvDU5', 'English', 2),
  book(10, 'Physics',     'Class 10 Physics',        'https://drive.google.com/uc?export=download&id=15dlzTvfTFfxRTPV50hmyF1g4qpxYtUb1'),
  book(10, 'Mathematics', 'Class 10 Mathematics Part 1', 'https://drive.google.com/uc?export=download&id=12h8i4yLsJAJZ3gc9_QBtABcVoTFW48Ri', 'English', 1),
  book(10, 'Mathematics', 'Class 10 Mathematics Part 2', 'https://drive.google.com/uc?export=download&id=1Ra4rzcl6IGai6FWVDFBlZClpk945cHYp', 'English', 2),
  book(10, 'Hindi',       'Class 10 Hindi Part 1',   'https://drive.google.com/uc?export=download&id=1NK7KlGb14463ewbd918QxR4ghZ4_76Xx', 'Hindi', 1),
  book(10, 'Hindi',       'Class 10 Hindi Part 2',   'https://drive.google.com/uc?export=download&id=1P_5N-ZYzG0jbaBZJGUEgNyG-dLbn6Hhn', 'Hindi', 2),
  book(10, 'Hindi',       'Class 10 Hindi Part 3',   'https://drive.google.com/uc?export=download&id=183HiqkrSOiqh2n4GKoroOxkdZ2mhU4ic', 'Hindi', 3),
  book(10, 'Sanskrit',    'Class 10 Sanskrit',       'https://drive.google.com/uc?export=download&id=1F3uSF4c3PePKvSe3m5NWBEhCyxMoy24t', 'Sanskrit'),
  book(10, 'English',     'Class 10 English Part 1', 'https://drive.google.com/uc?export=download&id=1WSa4dfjvjhsGZdzIdjRvBko6o4_RXGl8', 'English', 1),
  book(10, 'English',     'Class 10 English Part 2', 'https://drive.google.com/uc?export=download&id=1PyZcOYa8UWM4mt5CuNQVsbTvAmLWuO88', 'English', 2),
  book(10, 'English',     'Class 10 English Part 3', 'https://drive.google.com/uc?export=download&id=1QoVIGi4ZIHvGQT9kkXvo5fwdq7M18pAy', 'English', 3),

  // ── Class 11 ─────────────────────────────────────────────────────────────
  book(11, 'Physics',    'Class 11 Physics Part 1', 'https://drive.google.com/uc?export=download&id=11bz9jEEz1KK34XHtcCEZ2f--QVZBky7B', 'English', 1, 'Science'),
  book(11, 'Physics',    'Class 11 Physics Part 2', 'https://drive.google.com/uc?export=download&id=1ypw4Ya13amVHcZoGVYRpfI6DrbepV2nW', 'English', 2, 'Science'),
  book(11, 'Physics',    'Class 11 Physics Part 3', 'https://drive.google.com/uc?export=download&id=16-0QPMLwuKlORtJyxyRiOaWCZ7RGp75c', 'English', 3, 'Science'),
  book(11, 'Physics',    'Class 11 Physics Part 4', 'https://drive.google.com/uc?export=download&id=1iEMpZ2Jm1LkT5CufvxTwftj5ipEGN3LK', 'English', 4, 'Science'),
  book(11, 'Physics',    'Class 11 Physics Part 5', 'https://drive.google.com/uc?export=download&id=1l4aIXGgMzBWxK4hVAwobLQ-EohQdCgKH', 'English', 5, 'Science'),
  book(11, 'Mathematics','Class 11 Mathematics Part 1', 'https://drive.google.com/uc?export=download&id=1WCCPChHCpzI8Ob9ZaomjwbpU4Dlg8k1r', 'English', 1, 'Science'),
  book(11, 'Mathematics','Class 11 Mathematics Part 2', 'https://drive.google.com/uc?export=download&id=1tvETCWjr-qEiXlxQYo_ogA9NJmx3XMat', 'English', 2, 'Science'),
  book(11, 'Chemistry',  'Class 11 Chemistry Part 1', 'https://drive.google.com/uc?export=download&id=1tM1xpVvS5PvpzEY2WVUS8sd-j0X4TJTi', 'English', 1, 'Science'),
  book(11, 'Chemistry',  'Class 11 Chemistry Part 2', 'https://drive.google.com/uc?export=download&id=1CbW78-MI3hY2JeT0Stj9lqTe2ePVgen3', 'English', 2, 'Science'),
  book(11, 'Chemistry',  'Class 11 Chemistry Part 3', 'https://drive.google.com/uc?export=download&id=1ZrLT4pqeOZO371rnHDdRsScjxI0VNA7Q', 'English', 3, 'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 1',  'https://drive.google.com/uc?export=download&id=1JjTwGGDQYsNUofjU8ISuDMe7Blh_wHjr', 'English', 1,  'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 2',  'https://drive.google.com/uc?export=download&id=1DDKOEDcPwwO9LXXF8snOFPS4UwZ5FMRa', 'English', 2,  'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 3',  'https://drive.google.com/uc?export=download&id=1JcGtuj_0JzROpSGRccgw0lcOtaPgkhAG', 'English', 3,  'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 4',  'https://drive.google.com/uc?export=download&id=1DSCyWENdyBW9YlBDKbkH-DYUOq0TWlYG', 'English', 4,  'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 5',  'https://drive.google.com/uc?export=download&id=1xDoBMnpAOdukU9mnE4fgqa-6X95jswkA', 'English', 5,  'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 6',  'https://drive.google.com/uc?export=download&id=1eTVGi3YcyGEEwBGYX3s3eT4hg9uUqIQm', 'English', 6,  'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 7',  'https://drive.google.com/uc?export=download&id=1cgFGobCc2gx6jWXoOmKQDp17XbD7umRb', 'English', 7,  'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 8',  'https://drive.google.com/uc?export=download&id=18uYpjGWX6qGpFF59BXvYEki_bzU6smxv', 'English', 8,  'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 9',  'https://drive.google.com/uc?export=download&id=1Jmp49X5Z9bnVELXdb37kaAAzoSkuGMuJ', 'English', 9,  'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 10', 'https://drive.google.com/uc?export=download&id=1vO3ffwtPgObZUdmwDGaDMeKotJmGSUhm', 'English', 10, 'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 11', 'https://drive.google.com/uc?export=download&id=1aUR2-WInTb_xG61hBxh5jCur-rZXAInR', 'English', 11, 'Science'),
  book(11, 'Biology',    'Class 11 Biology Part 12', 'https://drive.google.com/uc?export=download&id=1wmNAmEgHnUtVALalCUR1Nf4nlRkDZXiM', 'English', 12, 'Science'),
  book(11, 'Science',    'Class 11 Science',         'https://drive.google.com/uc?export=download&id=15NVKZJ119QFKYYzigWWKhjCUIO4opKK9', 'English', undefined, 'Science'),
  book(11, 'Hindi',      'Class 11 Hindi',           'https://drive.google.com/uc?export=download&id=1tnDMKwzZiTbUThxYBcVOUi29_ll2RyZ3', 'Hindi'),
  book(11, 'Geography',  'Class 11 Geography',       'https://drive.google.com/uc?export=download&id=14lgFxoecgLPJB-q3K6Pj4Hzw0hRTf9go'),
  book(11, 'English',    'Class 11 English Part 1',  'https://drive.google.com/uc?export=download&id=1pbVfTrBWlN_2rosiyxMvxEODNDlTYmPf', 'English', 1),
  book(11, 'English',    'Class 11 English Part 2',  'https://drive.google.com/uc?export=download&id=1sxLrSqCMFxUQvuyjQAX6-fAhxQQqd3O-', 'English', 2),

  // ── Class 12 ─────────────────────────────────────────────────────────────
  book(12, 'Science',    'Class 12 Science',         'https://drive.google.com/uc?export=download&id=14bXmSSKwfsMNli1LVjL4otxI63wXj-RT', 'English', undefined, 'Science'),
  book(12, 'Physics',    'Class 12 Physics Part 1',  'https://drive.google.com/uc?export=download&id=107bye8mA9qihjrdHLBJNQRQCKB3rF-lw', 'English', 1, 'Science'),
  book(12, 'Physics',    'Class 12 Physics Part 2',  'https://drive.google.com/uc?export=download&id=1xCCQ6pNgDCmQEhGLh90MhvHmM1adgk1x', 'English', 2, 'Science'),
  book(12, 'Physics',    'Class 12 Physics Part 3',  'https://drive.google.com/uc?export=download&id=1_X0F1PG1w9X6PoHtk1KmIu4VXoGchKm2', 'English', 3, 'Science'),
  book(12, 'Geography',  'Class 12 Geography Part 1','https://drive.google.com/uc?export=download&id=1lwUlXkzrbSl2I44nsIbPti0SJbBCC28h', 'English', 1),
  book(12, 'Geography',  'Class 12 Geography Part 2','https://drive.google.com/uc?export=download&id=1LzunDVbLvKasbdcRdHDByseFSxUHGRVa', 'English', 2),
  book(12, 'English',    'Class 12 English Part 1',  'https://drive.google.com/uc?export=download&id=1u71g_0RvfZ39THUeiMPf-mDL6y8ieYqF', 'English', 1),
  book(12, 'English',    'Class 12 English Part 2',  'https://drive.google.com/uc?export=download&id=1sjYuwN8wz8ufFPbzjgZ8TQj057cEKshk', 'English', 2),
  book(12, 'Chemistry',  'Class 12 Chemistry Part 1','https://drive.google.com/uc?export=download&id=1mFXWXafPJ0NUOcxavvo5-HTAdk_o4JnV', 'English', 1, 'Science'),
  book(12, 'Chemistry',  'Class 12 Chemistry Part 2','https://drive.google.com/uc?export=download&id=18df-F9mIbp_nZIntYzJFlGnnE5oCT9Bj', 'English', 2, 'Science'),
  book(12, 'Chemistry',  'Class 12 Chemistry Part 3','https://drive.google.com/uc?export=download&id=1wqZs45dIjm0nL2_8beM00JmkXEhm491J', 'English', 3, 'Science'),
  book(12, 'Biology',    'Class 12 Biology Part 1',  'https://drive.google.com/uc?export=download&id=10Mk-f_9zJ-A3ZHgIFJ1joXK1rIcYtSbw', 'English', 1, 'Science'),
  book(12, 'Biology',    'Class 12 Biology Part 2',  'https://drive.google.com/uc?export=download&id=1wbsuk2KmxRcCmg0BZXRzWwmxP1Ivj3qu', 'English', 2, 'Science'),
  book(12, 'Mathematics','Class 12 Mathematics Part 1','https://drive.google.com/uc?export=download&id=1P1BRLM0M2lOw2ViKjAX20uU6AXrT4ggd','English', 1, 'Science'),
  book(12, 'Mathematics','Class 12 Mathematics Part 2','https://drive.google.com/uc?export=download&id=1KE4OzvO3Dp0fiEYSzXViMP1X6aIeiVO_','English', 2, 'Science'),
  book(12, 'History',    'Class 12 History',          'https://drive.google.com/uc?export=download&id=1LuP4sXxzTd0-uXkxIG3jPTBs8Dtv-gia'),
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const CLASS_RANGE = [6, 7, 8, 9, 10, 11, 12] as const;

export function getBooksForClass(classNum: number): PsebBook[] {
  return BOOKS.filter(b => b.classNum === classNum);
}

export function getSubjectsForClass(classNum: number): string[] {
  return [...new Set(getBooksForClass(classNum).map(b => b.subject))];
}

// ─── UI helpers ──────────────────────────────────────────────────────────────

export const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': 'rgb(180 103 7 / .12)',
  'Science':     'rgb(21 128 61 / .10)',
  'Physics':     'rgb(99 102 241 / .12)',
  'Chemistry':   'rgb(217 119 6 / .12)',
  'Biology':     'rgb(21 128 61 / .12)',
  'Geography':   'rgb(21 128 61 / .10)',
  'History':     'rgb(124 45 18 / .10)',
  'English':     'rgb(99 102 241 / .10)',
  'Hindi':       'rgb(217 119 6 / .09)',
  'Sanskrit':    'rgb(220 38 38 / .09)',
};

export const SUBJECT_EMOJI: Record<string, string> = {
  'Mathematics': '📐',
  'Science':     '🔬',
  'Physics':     '⚛️',
  'Chemistry':   '🧪',
  'Biology':     '🌿',
  'Geography':   '🗺️',
  'History':     '📜',
  'English':     '📖',
  'Hindi':       '🖊️',
  'Sanskrit':    '🕉️',
};
