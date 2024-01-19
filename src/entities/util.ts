import { Ref, isDocument } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
// import { BeAnObject, BeAnyObject } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';

export function filterOutId<T extends Base>(
  array: Ref<T>[],
  id: Types.ObjectId,
): Ref<T>[] {
  return array.filter((item) =>
    isDocument(item) ? !item._id.equals(id) : !item.equals(id),
  );
}

export function filterOutRef<T extends Base>(
  array: Ref<T>[],
  ref: T | Types.ObjectId,
): Ref<T>[] {
  const out = ref instanceof Types.ObjectId ? ref : ref._id;
  return array.filter((item) =>
    isDocument(item) ? !item._id.equals(out) : !item.equals(out),
  );
}
